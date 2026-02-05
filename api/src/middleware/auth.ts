import { Context, Next } from 'hono';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
    userEmail: string;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const token = authHeader.slice(7);
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    c.set('userId', payload.userId as string);
    c.set('userEmail', payload.email as string);
    
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
