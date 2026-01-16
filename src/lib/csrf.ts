/**
 * CSRF Protection utilities
 */

import { generateSecureToken } from './security';

// In-memory store for CSRF tokens (for production, use Redis or database)
interface CSRFStore {
  [key: string]: {
    token: string;
    expiresAt: number;
  };
}

const csrfStore: CSRFStore = {};

// CSRF token expiration time (1 hour)
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000;

/**
 * Generate and store CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const token = generateSecureToken(32);
  csrfStore[sessionId] = {
    token,
    expiresAt: Date.now() + CSRF_TOKEN_EXPIRY,
  };
  
  // Clean up expired tokens periodically
  if (Math.random() < 0.01) {
    cleanupExpiredTokens();
  }
  
  return token;
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfStore[sessionId];
  
  if (!stored) {
    return false;
  }
  
  // Check if token expired
  if (stored.expiresAt < Date.now()) {
    delete csrfStore[sessionId];
    return false;
  }
  
  // Verify token matches
  return stored.token === token;
}

/**
 * Clean up expired CSRF tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const sessionId in csrfStore) {
    if (csrfStore[sessionId].expiresAt < now) {
      delete csrfStore[sessionId];
    }
  }
}

/**
 * Get session ID from request (can be improved with actual session management)
 */
export function getSessionId(request: Request): string {
  // Try to get from cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    if (cookies['session-id']) {
      return cookies['session-id'];
    }
  }
  
  // Fallback: use IP + User-Agent as session identifier
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Create a simple hash-like identifier
  return `${ip}-${userAgent.substring(0, 20)}`;
}

