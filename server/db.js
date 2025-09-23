require('dotenv').config();
const { Pool } = require('pg');
const winston = require('winston');

console.log('Database configuration:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : 'empty',
  DB_PORT: process.env.DB_PORT
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'database.log' })
  ]
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dota_market',
  password: process.env.DB_PASSWORD || 'Admin_123!',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('Database client connected');
});

pool.on('acquire', (client) => {
  logger.info('Database client acquired from pool');
});

pool.on('remove', (client) => {
  logger.info('Database client removed from pool');
});

pool.on('error', (err, client) => {
  logger.error('Database pool error', {
    error: err.message,
    stack: err.stack
  });
});

pool.query('SELECT NOW()')
  .then((res) => {
    logger.info('Database connection test successful', {
      currentTime: res.rows[0].now
    });
  })
  .catch((err) => {
    logger.error('Database connection test failed', {
      error: err.message,
      stack: err.stack
    });
  });

module.exports = pool;