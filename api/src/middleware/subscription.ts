import { Context, Next } from 'hono';

// In-memory subscriptions (shared with routes/subscription.ts in real app, use DB)
const subscriptions = new Map<string, {
  status: 'free' | 'premium';
  expiresAt?: number;
}>();

export const checkSubscription = async (c: Context, next: Next) => {
  const userId = c.get('userId');
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const sub = subscriptions.get(userId);
  
  // Check if user has active premium subscription
  const isPremium = sub?.status === 'premium' && 
    (!sub.expiresAt || sub.expiresAt > Date.now());
  
  if (!isPremium) {
    return c.json({ 
      error: 'Premium subscription required',
      code: 'SUBSCRIPTION_REQUIRED',
    }, 403);
  }
  
  await next();
};

// Helper to set subscription (for testing/internal use)
export const setSubscription = (userId: string, status: 'free' | 'premium', expiresAt?: number) => {
  subscriptions.set(userId, { status, expiresAt });
};

export const getSubscription = (userId: string) => {
  return subscriptions.get(userId) || { status: 'free' as const };
};
