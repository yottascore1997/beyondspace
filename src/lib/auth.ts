import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}

export function requireAuth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (request: NextRequest, user: AuthUser, context?: any) => Promise<Response>
) {
  // Support Next Route Handlers signature: (request, context)
  // Pass through context (e.g., { params }) to handler
  return async (request: NextRequest, context?: unknown) => {
    const user = await getAuthUser(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // @ts-expect-error context passthrough
    return handler(request, user, context);
  };
}

export function requireAdmin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (request: NextRequest, user: AuthUser, context?: any) => Promise<Response>
) {
  return async (request: NextRequest, context?: unknown) => {
    const user = await getAuthUser(request);
    
    if (!user || user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // @ts-expect-error context passthrough
    return handler(request, user, context);
  };
}

