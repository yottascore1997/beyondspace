/**
 * Application-level Firewall Security
 * 
 * This provides IP-based access control, blocking, and whitelisting
 * Note: For production, also use infrastructure-level firewalls (AWS WAF, Cloudflare, etc.)
 */

interface IPRule {
  ip: string;
  type: 'allow' | 'block';
  reason?: string;
  expiresAt?: number; // Unix timestamp, optional
}

interface FirewallConfig {
  enabled: boolean;
  defaultAction: 'allow' | 'block'; // Default action if IP not in rules
  whitelist: string[]; // Always allowed IPs
  blacklist: string[]; // Always blocked IPs
  rules: IPRule[];
  maxRequestsPerMinute: number; // Auto-block suspicious IPs
  suspiciousIPs: Map<string, { count: number; firstSeen: number }>;
}

// Localhost IPs that should always be allowed (development)
const LOCALHOST_IPS = ['127.0.0.1', '::1', 'localhost', 'unknown'];

// In-memory store (for production, use Redis or database)
const firewallConfig: FirewallConfig = {
  enabled: process.env.FIREWALL_ENABLED === 'true',
  defaultAction: 'allow',
  whitelist: [
    // Always whitelist localhost IPs for development
    ...LOCALHOST_IPS,
    // User-defined whitelist
    ...(process.env.FIREWALL_WHITELIST?.split(',').map(ip => ip.trim()) || []),
  ],
  blacklist: process.env.FIREWALL_BLACKLIST?.split(',').map(ip => ip.trim()) || [],
  rules: [],
  maxRequestsPerMinute: parseInt(process.env.FIREWALL_MAX_REQUESTS_PER_MINUTE || '200', 10), // Increased default threshold
  suspiciousIPs: new Map(),
};

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // In development, always return localhost
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }

  // Try to get IP from headers (for proxies/load balancers like Railway, Vercel, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs: client, proxy1, proxy2
    // First IP is usually the original client IP
    const ips = forwarded.split(',').map(ip => ip.trim()).filter(ip => ip);
    if (ips.length > 0) {
      const clientIP = ips[0];
      // Validate IP format (basic check)
      if (clientIP && /^[\d.]+$/.test(clientIP) || /^[\da-fA-F:]+$/.test(clientIP)) {
        return clientIP;
      }
    }
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    const ip = realIP.trim();
    // Validate IP format
    if (ip && (/^[\d.]+$/.test(ip) || /^[\da-fA-F:]+$/.test(ip))) {
      return ip;
    }
  }

  // Try CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    const ip = cfIP.trim();
    if (ip && (/^[\d.]+$/.test(ip) || /^[\da-fA-F:]+$/.test(ip))) {
      return ip;
    }
  }

  // Fallback - in production, if we can't determine IP, don't block
  // Return a special value that will be allowed
  return 'unknown';
}

/**
 * Check if IP is localhost
 */
function isLocalhost(ip: string): boolean {
  return LOCALHOST_IPS.includes(ip) || 
         ip === '127.0.0.1' || 
         ip === '::1' || 
         ip === 'localhost' ||
         ip === 'unknown' ||
         ip.startsWith('127.') ||
         ip.startsWith('::1') ||
         ip.startsWith('localhost');
}

/**
 * Check if IP is allowed
 */
export function isIPAllowed(ip: string): { allowed: boolean; reason?: string } {
  // Always allow localhost in development
  if (process.env.NODE_ENV === 'development' && isLocalhost(ip)) {
    return { allowed: true, reason: 'Localhost always allowed in development' };
  }

  // Always allow unknown IPs (can't determine IP - don't block)
  if (ip === 'unknown') {
    return { allowed: true, reason: 'IP could not be determined - allowing access' };
  }

  if (!firewallConfig.enabled) {
    return { allowed: true };
  }

  // Check whitelist first (highest priority)
  if (firewallConfig.whitelist.length > 0) {
    if (firewallConfig.whitelist.some(allowedIP => matchesIP(ip, allowedIP))) {
      return { allowed: true, reason: 'IP is whitelisted' };
    }
  }

  // Check blacklist (second priority)
  if (firewallConfig.blacklist.length > 0) {
    if (firewallConfig.blacklist.some(blockedIP => matchesIP(ip, blockedIP))) {
      return { allowed: false, reason: 'IP is blacklisted' };
    }
  }

  // Check rules
  const now = Date.now();
  for (const rule of firewallConfig.rules) {
    if (matchesIP(ip, rule.ip)) {
      // Check if rule expired
      if (rule.expiresAt && rule.expiresAt < now) {
        continue; // Skip expired rules
      }
      
      if (rule.type === 'block') {
        return { allowed: false, reason: rule.reason || 'IP is blocked by firewall rule' };
      } else if (rule.type === 'allow') {
        return { allowed: true, reason: rule.reason || 'IP is allowed by firewall rule' };
      }
    }
  }

  // Check for suspicious activity (skip for localhost and unknown IPs)
  if (!isLocalhost(ip) && ip !== 'unknown') {
    const suspicious = firewallConfig.suspiciousIPs.get(ip);
    if (suspicious) {
      const timeDiff = Date.now() - suspicious.firstSeen;
      // Avoid division by zero and require at least 1 second
      if (timeDiff > 1000) {
        const requestsPerMinute = (suspicious.count / timeDiff) * 60000;
        
        // Only block if significantly exceeding threshold (2x to avoid false positives)
        const threshold = firewallConfig.maxRequestsPerMinute * 2;
        
        if (requestsPerMinute > threshold) {
          // Auto-block suspicious IP (but log first)
          console.warn(`[Firewall] Suspicious activity detected from IP: ${ip}, RPM: ${requestsPerMinute.toFixed(2)}`);
          
          // Only auto-block in production and if threshold is significantly exceeded
          if (process.env.NODE_ENV === 'production' && requestsPerMinute > threshold * 1.5) {
            addBlockRule(ip, 'Auto-blocked due to suspicious activity', 60 * 60 * 1000); // Block for 1 hour
            return { allowed: false, reason: 'Auto-blocked due to suspicious activity' };
          }
        }
      }
    }
  }

  // Default action
  return { 
    allowed: firewallConfig.defaultAction === 'allow',
    reason: firewallConfig.defaultAction === 'block' ? 'IP not whitelisted' : undefined
  };
}

/**
 * Check if IP matches pattern (supports CIDR notation and wildcards)
 */
function matchesIP(ip: string, pattern: string): boolean {
  // Exact match
  if (ip === pattern) {
    return true;
  }

  // CIDR notation (e.g., 192.168.1.0/24)
  if (pattern.includes('/')) {
    return matchesCIDR(ip, pattern);
  }

  // Wildcard pattern (e.g., 192.168.*)
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(ip);
  }

  return false;
}

/**
 * Check if IP matches CIDR notation
 */
function matchesCIDR(ip: string, cidr: string): boolean {
  try {
    const [network, prefixLength] = cidr.split('/');
    const prefix = parseInt(prefixLength, 10);
    
    const ipParts = ip.split('.').map(Number);
    const networkParts = network.split('.').map(Number);
    
    if (ipParts.length !== 4 || networkParts.length !== 4) {
      return false;
    }

    // Convert to 32-bit integers
    const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
    const networkNum = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3];
    
    const mask = ~((1 << (32 - prefix)) - 1);
    
    return (ipNum & mask) === (networkNum & mask);
  } catch {
    return false;
  }
}

/**
 * Track request from IP (for suspicious activity detection)
 */
export function trackRequest(ip: string): void {
  // Don't track localhost, unknown IPs, or if firewall is disabled
  if (!firewallConfig.enabled || isLocalhost(ip) || ip === 'unknown' || process.env.NODE_ENV === 'development') {
    return;
  }

  const now = Date.now();
  const existing = firewallConfig.suspiciousIPs.get(ip);

  if (existing) {
    // Reset if more than 1 minute passed
    if (now - existing.firstSeen > 60000) {
      firewallConfig.suspiciousIPs.set(ip, { count: 1, firstSeen: now });
    } else {
      existing.count++;
    }
  } else {
    firewallConfig.suspiciousIPs.set(ip, { count: 1, firstSeen: now });
  }

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    cleanupSuspiciousIPs();
  }
}

/**
 * Add block rule
 */
export function addBlockRule(ip: string, reason?: string, durationMs?: number): void {
  const expiresAt = durationMs ? Date.now() + durationMs : undefined;
  firewallConfig.rules.push({
    ip,
    type: 'block',
    reason,
    expiresAt,
  });
}

/**
 * Add allow rule
 */
export function addAllowRule(ip: string, reason?: string, durationMs?: number): void {
  const expiresAt = durationMs ? Date.now() + durationMs : undefined;
  firewallConfig.rules.push({
    ip,
    type: 'allow',
    reason,
    expiresAt,
  });
}

/**
 * Remove rule for IP
 */
export function removeRule(ip: string): void {
  firewallConfig.rules = firewallConfig.rules.filter(rule => rule.ip !== ip);
}

/**
 * Clean up expired rules
 */
function cleanupSuspiciousIPs(): void {
  const now = Date.now();
  for (const [ip, data] of firewallConfig.suspiciousIPs.entries()) {
    if (now - data.firstSeen > 60000) {
      firewallConfig.suspiciousIPs.delete(ip);
    }
  }

  // Clean up expired rules
  firewallConfig.rules = firewallConfig.rules.filter(rule => {
    if (rule.expiresAt) {
      return rule.expiresAt > now;
    }
    return true;
  });
}

/**
 * Get firewall status for IP
 */
export function getFirewallStatus(ip: string): {
  allowed: boolean;
  reason?: string;
  isWhitelisted: boolean;
  isBlacklisted: boolean;
  requestCount?: number;
} {
  const check = isIPAllowed(ip);
  const suspicious = firewallConfig.suspiciousIPs.get(ip);
  
  return {
    allowed: check.allowed,
    reason: check.reason,
    isWhitelisted: firewallConfig.whitelist.some(allowedIP => matchesIP(ip, allowedIP)),
    isBlacklisted: firewallConfig.blacklist.some(blockedIP => matchesIP(ip, blockedIP)),
    requestCount: suspicious?.count,
  };
}

/**
 * Clear blocked rules for localhost (useful for development)
 */
export function clearLocalhostBlocks(): void {
  firewallConfig.rules = firewallConfig.rules.filter(rule => {
    return !isLocalhost(rule.ip);
  });
  
  // Clear suspicious IPs for localhost
  for (const localhostIP of LOCALHOST_IPS) {
    firewallConfig.suspiciousIPs.delete(localhostIP);
  }
}

/**
 * Firewall middleware for Next.js
 */
export function firewallMiddleware(request: Request): { allowed: boolean; status: number; message: string } {
  const ip = getClientIP(request);
  
  // In development, clear any localhost blocks
  if (process.env.NODE_ENV === 'development' && isLocalhost(ip)) {
    clearLocalhostBlocks();
  }
  
  // Check if allowed first (before tracking)
  const check = isIPAllowed(ip);
  
  // Only track if IP is valid and not localhost/unknown
  if (check.allowed && ip !== 'unknown' && !isLocalhost(ip)) {
    trackRequest(ip);
  }
  
  if (!check.allowed) {
    // Log blocked requests for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Firewall] Blocked request from IP: ${ip}, Reason: ${check.reason}`);
    }
    
    return {
      allowed: false,
      status: 403,
      message: check.reason || 'Access denied by firewall',
    };
  }
  
  return {
    allowed: true,
    status: 200,
    message: 'OK',
  };
}

