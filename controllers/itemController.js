// Импортируем объект pool для работы с базой данных
const pool = require('../config/db');

// Экспортируем функцию получения всех товаров
exports.getAllItems = async (req, res) => {
    try {
        // Выполняем SQL-запрос для выборки всех записей из таблицы items
        const result = await pool.query('SELECT * FROM items');
        // Отправляем данные в формате JSON
        res.json(result.rows);
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

// Экспортируем функцию получения товара по ID
exports.getItemById = async (req, res) => {
    try {
        // Выполняем SQL-запрос для выборки записи по ID
        const result = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
        // Отправляем найденный товар
        res.json(result.rows[0]);
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to fetch item' });
    }
};