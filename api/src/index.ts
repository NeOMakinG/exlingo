import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { authRoutes } from './routes/auth.js';
import { translateRoutes } from './routes/translate.js';
import { syncRoutes } from './routes/sync.js';
import { subscriptionRoutes } from './routes/subscription.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:8081', 'exp://'],
  credentials: true,
}));

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'exlingo-api' }));
app.get('/health', (c) => c.json({ status: 'healthy' }));

// Routes
app.route('/auth', authRoutes);
app.route('/translate', translateRoutes);
app.route('/sync', syncRoutes);
app.route('/subscription', subscriptionRoutes);

// Error handling
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

const port = parseInt(process.env.PORT || '3000');
console.log(`🚀 LingoNotes API running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
