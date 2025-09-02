const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const winston = require('winston'); 


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
app.use((req, res, next) => {
  logger.info('CORS check', {
    origin: req.get('origin'),
    allowed: 'http://localhost:3000'
  });
  next();
});

app.use(express.json());


app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.on('connect', () => {
  logger.info('Database connection established successfully');
});

pool.on('error', (err) => {
  logger.error('Database connection error', {
    error: err.message,
    stack: err.stack
  });
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection test failed', {
      error: err.message,
      stack: err.stack
    });
  } else {
    logger.info('Database connection test successful', {
      result: res.rows[0].now
    });
  }
});

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


app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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