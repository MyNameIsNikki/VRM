const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Правильные пути для require (добавляем routes/)
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const ordersRoutes = require('./routes/orders');
const sellersRoutes = require('./routes/sellers');
const purchaseHistoryRoutes = require('./routes/purchaseHistory');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', //тут короче домен на котором фронт будет
  credentials: true
}));

// Подключение к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.locals.pool = pool;

// Правильное подключение роутов (без server/routes/)
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/purchase-history', purchaseHistoryRoutes);

// Проверка сервера
app.get('/', (req, res) => {
  res.json({ message: 'Dota Marketplace Server is running!' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});