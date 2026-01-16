/**
 * Security utilities for input validation, sanitization, and password validation
 */

// Password validation
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
    errors.push('Password is too common. Please choose a stronger password');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Mobile number validation (Indian format)
export function validateMobile(mobile: string): { isValid: boolean; cleaned: string } {
  if (!mobile) return { isValid: false, cleaned: '' };
  
  // Extract only digits
  const mobileDigits = mobile.replace(/\D/g, '');
  
  // Extract last 10 digits (in case country code is included)
  const phoneNumber = mobileDigits.length >= 10 
    ? mobileDigits.slice(-10) 
    : mobileDigits;
  
  const mobileRegex = /^[6-9]\d{9}$/;
  return {
    isValid: mobileRegex.test(phoneNumber),
    cleaned: phoneNumber,
  };
}

// XSS Prevention - Basic HTML sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize object recursively
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject((obj as any)[key]);
      }
    }
    return sanitized as T;
  }
  
  return obj;
}

// Validate file type
export function validateFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  return allowedTypes.includes(extension);
}

// Validate file size (in bytes)
export function validateFileSize(
  size: number,
  maxSize: number
): boolean {
  return size > 0 && size <= maxSize;
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use Web Crypto API if available (browser/Node.js 18+), otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      token += chars[randomValues[i] % chars.length];
    }
  } else {
    // Fallback for older environments
    const nodeCrypto = require('crypto');
    const randomBytes = nodeCrypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      token += chars[randomBytes[i] % chars.length];
    }
  }
  
  return token;
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

