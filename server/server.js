const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const winston = require('winston'); 

// Импортируем пул
const pool = require('./db');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const ordersRoutes = require('./routes/orders');
const sellersRoutes = require('./routes/sellers');
const purchaseHistoryRoutes = require('./routes/purchaseHistory');

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    time: new Date().toISOString()
  });
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Используем импортированный пул
app.locals.pool = pool;

const logRoute = (routeName) => (req, res, next) => {
  logger.info(`Processing ${routeName} request`, {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body
  });
  next();
};

app.use('/api/auth', logRoute('auth'), authRoutes);
app.use('/api/items', logRoute('items'), itemsRoutes);
app.use('/api/orders', logRoute('orders'), ordersRoutes);
app.use('/api/sellers', logRoute('sellers'), sellersRoutes);
app.use('/api/purchase-history', logRoute('purchase-history'), purchaseHistoryRoutes);

app.get('/health', async (req, res) => {
  logger.info('Health check requested');
  try {
    // Проверяем подключение к БД
    await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.json({ 
    message: 'Dota Marketplace Server is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((err, req, res, next) => {
  logger.error('Server error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});