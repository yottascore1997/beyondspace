/**
 * Rate limiting utility for API endpoints
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis or similar)
const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: Request) => string; // Custom key generator
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Rate limiter middleware
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options;

  return (request: Request): RateLimitResult => {
    // Generate key (default: IP address)
    const key = keyGenerator 
      ? keyGenerator(request)
      : getClientIP(request);

    const now = Date.now();
    const record = store[key];

    // Clean up old records periodically
    if (Math.random() < 0.01) {
      cleanupExpiredRecords(now);
    }

    if (!record || record.resetTime < now) {
      // New window
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (record.count >= maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    // Increment count
    record.count++;
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime,
    };
  };
}

/**
 * Get client IP address from request
 */
function getClientIP(request: Request): string {
  // Try to get IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (won't work in serverless, but good for development)
  return 'unknown';
}

/**
 * Clean up expired rate limit records
 */
function cleanupExpiredRecords(now: number): void {
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  // Strict rate limit for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  }),

  // Moderate rate limit for API endpoints
  api: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  }),

  // Lenient rate limit for general endpoints
  general: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  }),

  // File upload rate limit
  upload: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
  }),
};

