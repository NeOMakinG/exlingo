import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { checkSubscription } from '../middleware/subscription.js';

const app = new Hono();

// In-memory store for demo (replace with actual database)
const userDataStore = new Map<string, any>();

// Get user data
app.get('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const data = userDataStore.get(userId);
  
  return c.json({
    data: data || null,
    lastSync: data?.updatedAt || null,
  });
});

// Sync user data - Premium feature
app.post('/', authMiddleware, checkSubscription, async (c) => {
  try {
    const userId = c.get('userId');
    const { languageSheets, settings, lastLocalUpdate } = await c.req.json();
    
    const existing = userDataStore.get(userId);
    
    // Simple last-write-wins conflict resolution
    // In production, implement proper conflict resolution
    if (existing && existing.updatedAt > lastLocalUpdate) {
      // Server has newer data
      return c.json({
        conflict: true,
        serverData: existing,
        message: 'Server has newer data',
      });
    }
    
    // Save new data
    const newData = {
      languageSheets,
      settings,
      updatedAt: Date.now(),
    };
    
    userDataStore.set(userId, newData);
    
    return c.json({
      success: true,
      data: newData,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return c.json({ error: 'Sync failed' }, 500);
  }
});

// Delete user data
app.delete('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  userDataStore.delete(userId);
  
  return c.json({ success: true });
});

export { app as syncRoutes };
