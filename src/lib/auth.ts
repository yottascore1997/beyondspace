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

export function requireAuth(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(request, user);
  };
}

export function requireAdmin(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);
    
    if (!user || user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(request, user);
  };
}

