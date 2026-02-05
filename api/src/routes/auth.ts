import { Hono } from 'hono';
import * as jose from 'jose';
import { z } from 'zod';

const app = new Hono();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Google OAuth verification
const verifyGoogleToken = async (idToken: string) => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );
  if (!response.ok) throw new Error('Invalid Google token');
  return response.json();
};

// Apple Sign In verification
const verifyAppleToken = async (idToken: string) => {
  // Fetch Apple's public keys
  const keysResponse = await fetch('https://appleid.apple.com/auth/keys');
  const keys = await keysResponse.json();
  
  // Decode and verify the token
  const header = jose.decodeProtectedHeader(idToken);
  const key = keys.keys.find((k: any) => k.kid === header.kid);
  
  if (!key) throw new Error('Invalid Apple token');
  
  const publicKey = await jose.importJWK(key, 'RS256');
  const { payload } = await jose.jwtVerify(idToken, publicKey, {
    issuer: 'https://appleid.apple.com',
  });
  
  return payload;
};

// Generate our own JWT
const generateToken = async (userId: string, email: string) => {
  return new jose.SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
};

// Sign in with Google
app.post('/google', async (c) => {
  try {
    const { idToken } = await c.req.json();
    
    const googleUser = await verifyGoogleToken(idToken);
    
    // TODO: Create or get user from database
    const userId = googleUser.sub;
    const email = googleUser.email;
    
    const token = await generateToken(userId, email);
    
    return c.json({
      token,
      user: {
        id: userId,
        email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
});

// Sign in with Apple
app.post('/apple', async (c) => {
  try {
    const { idToken, user: appleUser } = await c.req.json();
    
    const payload = await verifyAppleToken(idToken);
    
    // TODO: Create or get user from database
    const userId = payload.sub as string;
    const email = (payload.email as string) || appleUser?.email;
    
    const token = await generateToken(userId, email);
    
    return c.json({
      token,
      user: {
        id: userId,
        email,
        name: appleUser?.fullName
          ? `${appleUser.fullName.givenName} ${appleUser.fullName.familyName}`
          : undefined,
      },
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
});

// Verify token
app.get('/verify', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'No token provided' }, 401);
  }
  
  try {
    const token = authHeader.slice(7);
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    return c.json({ valid: true, user: payload });
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

export { app as authRoutes };
