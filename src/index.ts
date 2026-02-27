import express from 'express';
import { settings } from './config/settings';
import { db } from './db';

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

// Start server
app.listen(settings.PORT, () => {
  console.log(`🚀 Server running on port ${settings.PORT}`);
  console.log(`📊 Environment: ${settings.NODE_ENV}`);
  console.log(`🗄️  Database: ${settings.DATABASE_URL.split('@')[1]}`);
});
