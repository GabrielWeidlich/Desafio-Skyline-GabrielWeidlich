import express from 'express';
import { settings } from './config/settings';
import { db } from './db';
import { errorHandler } from './middleware/errorHandler';
import taskRoutes from './routes/tasks';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: settings.NODE_ENV,
    port: settings.PORT,
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Node.js TypeScript Drizzle API',
    version: '1.0.0',
  });
});

// Task routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(settings.PORT, () => {
  console.log(`🚀 Server running on port ${settings.PORT}`);
  console.log(`📊 Environment: ${settings.NODE_ENV}`);
  console.log(`🗄️  Database: ${settings.DATABASE_URL.split('@')[1]}`);
});
