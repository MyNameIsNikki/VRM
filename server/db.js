require('dotenv').config();
const { Pool } = require('pg');
const winston = require('winston');


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


logger.info('Database configuration initialized', {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dota_market',
  port: process.env.DB_PORT || 5432
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dota_market',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
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


const originalQuery = pool.query;
pool.query = function (...args) {
  const start = Date.now();
  logger.info('Executing database query', {
    query: args[0],
    params: args[1] || []
  });

  const promise = originalQuery.apply(this, args);
  
  promise
    .then((result) => {
      logger.info('Database query completed', {
        duration: `${Date.now() - start}ms`,
        rowCount: result.rowCount
      });
      return result;
    })
    .catch((err) => {
      logger.error('Database query error', {
        query: args[0],
        params: args[1] || [],
        error: err.message,
        stack: err.stack,
        duration: `${Date.now() - start}ms`
      });
      throw err;
    });

  return promise;
};


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