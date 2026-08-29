import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import customersRouter from './routes/customers.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import inventoryRouter from './routes/inventory.js';
import settingsRouter from './routes/settings.js';
import billsRouter from './routes/bills.js';
import reportsRouter from './routes/reports.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { assignRequestId, requestLogger } from './middleware/requestLogger.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// ===== CORS MUST BE FIRST =====
// Dynamically build list of allowed origins from environment variables
const envClientUrls = (process.env.CLIENT_URL || '').split(/[\s,]+/).map(u => u.trim()).filter(Boolean);
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(/[\s,]+/).map(u => u.trim()).filter(Boolean);

const defaultAllowedOrigins = [
  'https://sargurucrackers.com',
  'https://www.sargurucrackers.com',
  'http://sargurucrackers.com',
  'http://www.sargurucrackers.com',
  'http://187.127.148.51',
  'http://187.127.148.51:5002',
  'http://localhost:5173',
  'http://localhost:5002',
  'http://localhost:3000'
];

const allowedOrigins = [
  ...envClientUrls,
  ...envAllowedOrigins,
  ...defaultAllowedOrigins
].map(u => u.toLowerCase().replace(/\/$/, '')).filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser clients (curl, mobile apps, server-to-server)
  
  const cleanOrigin = origin.toLowerCase().replace(/\/$/, '');
  
  if (allowedOrigins.includes('*') || allowedOrigins.includes(cleanOrigin)) {
    return true;
  }
  
  try {
    const url = new URL(cleanOrigin);
    const hostname = url.hostname;
    
    if (
      hostname === 'sargurucrackers.com' ||
      hostname.endsWith('.sargurucrackers.com') ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.netlify.app') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '187.127.148.51'
    ) {
      return true;
    }
  } catch (e) {
    // Malformed URL, fallback check
  }

  return process.env.NODE_ENV === 'development';
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      logger.warn('Blocked by CORS', { origin });
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ===== THEN other middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Integrate request logger
app.use(assignRequestId);
app.use(requestLogger);

// ===== THEN static =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from './config/db.js';

// Connect to database
connectDB();

logger.info('Server initialized');

// Health Check — must be BEFORE express.static so it isn't intercepted by index.html
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Sarguru backend is running', status: 'ok' });
});

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/customers', customersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/bills', billsRouter);
app.use('/api/reports', reportsRouter);

// 404 Handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Root route handler
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({ status: 'ok', message: 'Cracker Hub Backend API is running' });
});

// For any other route, serve the frontend index.html if present, else 404
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler (must be last)
app.use(errorHandler);

import { exec } from 'child_process';
import os from 'os';

const PORT = process.env.PORT || 5002;

const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use by another process. Please stop conflicting processes or change PORT in .env.`);
        process.exit(1);
      } else {
        logger.error('Server error:', { error: err });
        process.exit(1);
      }
    });
  } catch (err) {
    logger.error('Failed to start server:', { error: err });
    process.exit(1);
  }
};

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully.');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT RECEIVED. Shutting down gracefully.');
  process.exit(0);
});

startServer();

export default app;
