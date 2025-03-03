// Импортируем объект pool для работы с базой данных
const pool = require('../config/db');

// Экспортируем функцию получения всех товаров для админа
exports.getAllItems = async (req, res) => {
    try {
        // Выполняем SQL-запрос для выборки всех записей из таблицы items
        const result = await pool.query('SELECT * FROM items');
        // Отправляем данные
        res.json(result.rows);
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

// Экспортируем функцию добавления нового товара
exports.addItem = async (req, res) => {
    // Извлекаем данные из тела запроса
    const { name, price, discount, image_url, description } = req.body;
    try {
        // Выполняем SQL-запрос для вставки нового товара
        const result = await pool.query(
            'INSERT INTO items (name, price, discount, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, price, discount, image_url, description]
        );
        // Отправляем добавленный товар
        res.json(result.rows[0]);
    } catch (error) {
        // Обработка ошибок (например, неверные данные)
        res.status(500).json({ error: 'Failed to add item' });
    }
};

// Экспортируем функцию обновления товара
exports.updateItem = async (req, res) => {
    // Извлекаем данные из тела запроса
    const { name, price, discount, image_url, description } = req.body;
    try {
        // Выполняем SQL-запрос для обновления товара по ID
        const result = await pool.query(
            'UPDATE items SET name = $1, price = $2, discount = $3, image_url = $4, description = $5 WHERE id = $6 RETURNING *',
            [name, price, discount, image_url, description, req.params.id]
        );
        // Отправляем обновленный товар
        res.json(result.rows[0]);
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to update item' });
    }
};

// Экспортируем функцию удаления товара
exports.deleteItem = async (req, res) => {
    try {
        // Выполняем SQL-запрос для удаления товара по ID
        await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
        // Отправляем сообщение об успехе
        res.json({ message: 'Item deleted' });
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to delete item' });
    }
};