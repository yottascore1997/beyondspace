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

// In-memory store (for production, use Redis or database)
const firewallConfig: FirewallConfig = {
  enabled: process.env.FIREWALL_ENABLED === 'true',
  defaultAction: 'allow',
  whitelist: process.env.FIREWALL_WHITELIST?.split(',').map(ip => ip.trim()) || [],
  blacklist: process.env.FIREWALL_BLACKLIST?.split(',').map(ip => ip.trim()) || [],
  rules: [],
  maxRequestsPerMinute: parseInt(process.env.FIREWALL_MAX_REQUESTS_PER_MINUTE || '100', 10),
  suspiciousIPs: new Map(),
};

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try to get IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Fallback
  return 'unknown';
}

/**
 * Check if IP is allowed
 */
export function isIPAllowed(ip: string): { allowed: boolean; reason?: string } {
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

  // Check for suspicious activity
  const suspicious = firewallConfig.suspiciousIPs.get(ip);
  if (suspicious) {
    const timeDiff = Date.now() - suspicious.firstSeen;
    const requestsPerMinute = (suspicious.count / timeDiff) * 60000;
    
    if (requestsPerMinute > firewallConfig.maxRequestsPerMinute) {
      // Auto-block suspicious IP
      addBlockRule(ip, 'Auto-blocked due to suspicious activity', 60 * 60 * 1000); // Block for 1 hour
      return { allowed: false, reason: 'IP blocked due to suspicious activity' };
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
  if (!firewallConfig.enabled || ip === 'unknown') {
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
 * Firewall middleware for Next.js
 */
export function firewallMiddleware(request: Request): { allowed: boolean; status: number; message: string } {
  const ip = getClientIP(request);
  
  // Track request
  trackRequest(ip);
  
  // Check if allowed
  const check = isIPAllowed(ip);
  
  if (!check.allowed) {
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

