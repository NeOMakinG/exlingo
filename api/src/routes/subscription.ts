import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const app = new Hono();

// In-memory subscriptions for demo (replace with Stripe/RevenueCat integration)
const subscriptions = new Map<string, {
  status: 'free' | 'premium';
  expiresAt?: number;
  plan?: string;
}>();

// Get subscription status
app.get('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const sub = subscriptions.get(userId) || { status: 'free' };
  
  // Check if premium has expired
  if (sub.status === 'premium' && sub.expiresAt && sub.expiresAt < Date.now()) {
    sub.status = 'free';
    subscriptions.set(userId, sub);
  }
  
  return c.json(sub);
});

// Verify purchase (placeholder for App Store / Play Store verification)
app.post('/verify', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { platform, receipt, productId } = await c.req.json();
    
    // TODO: Implement actual receipt verification
    // For iOS: verify with Apple's verifyReceipt endpoint
    // For Android: verify with Google Play Developer API
    
    // Demo: Just activate premium for testing
    if (process.env.NODE_ENV === 'development') {
      subscriptions.set(userId, {
        status: 'premium',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        plan: productId,
      });
      
      return c.json({
        success: true,
        subscription: subscriptions.get(userId),
      });
    }
    
    return c.json({ error: 'Receipt verification not implemented' }, 501);
  } catch (error) {
    console.error('Subscription verification error:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// Webhook for subscription events (Stripe, RevenueCat, etc.)
app.post('/webhook', async (c) => {
  // TODO: Implement webhook handling for subscription events
  // Verify webhook signature
  // Update user subscription status
  
  return c.json({ received: true });
});

export { app as subscriptionRoutes };
