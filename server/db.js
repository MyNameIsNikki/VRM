require('dotenv').config();
const { Pool } = require('pg');

console.log('DB Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '[REDACTED]' : undefined,
  port: process.env.DB_PORT
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dota_market',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});
module.exports = pool;