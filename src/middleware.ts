import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { firewallMiddleware, getClientIP } from '@/lib/firewall';

export function middleware(request: NextRequest) {
  // Firewall check (only for API routes and admin routes)
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/admin')) {
    const firewallCheck = firewallMiddleware(request as any);
    if (!firewallCheck.allowed) {
      return NextResponse.json(
        { error: firewallCheck.message },
        { status: firewallCheck.status }
      );
    }
  }

  const response = NextResponse.next();

  // Security Headers
  const securityHeaders = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // XSS Protection (legacy, but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust based on your needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://files.beyondspacework.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com",
      "frame-ancestors 'none'",
    ].join('; '),
  };

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // HSTS (HTTP Strict Transport Security) - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // CORS Headers (for API routes)
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

