const pool = require('./db');

async function testConnection() {
  console.log('Попытка подключения к базе данных...');
  try {
    const client = await pool.connect();
    console.log('✓ Подключение к БД успешно установлено');
    
    // Проверка версии PostgreSQL
    const versionRes = await client.query('SELECT version()');
    console.log('Версия PostgreSQL:', versionRes.rows[0].version.split(',')[0]);
    
    // Проверка текущего времени
    const timeRes = await client.query('SELECT NOW() AS current_time');
    console.log('Текущее время БД:', timeRes.rows[0].current_time);
    
    // Проверка наличия основных таблиц
    console.log('\nПроверка наличия таблиц:');
    const requiredTables = [
      'skins', 'users', 'sellers', 
      'zakaz', 'history'
    ];
    
    for (const table of requiredTables) {
      try {
        const checkRes = await client.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )`,
          [table.toLowerCase()]
        );
        
        const exists = checkRes.rows[0].exists;
        console.log(`- Таблица "${table}": ${exists ? '✓ найдена' : '✗ отсутствует'}`);
        
        if (exists) {
          // Проверка количества записей
          const countRes = await client.query(`SELECT COUNT(*) FROM public."${table}"`);
          console.log(`  Записей: ${countRes.rows[0].count}`);
          
          // Получаем все записи таблицы
          const dataRes = await client.query(`SELECT * FROM public."${table}"`);
          console.log('  Содержимое таблицы:');
          if (dataRes.rows.length === 0) {
            console.log('    Нет данных в таблице.');
          } else {
            dataRes.rows.forEach((row, index) => {
              console.log(`    Запись ${index + 1}:`, JSON.stringify(row));
            });
          }
        }
      } catch (tableError) {
        console.error(`  Ошибка проверки таблицы "${table}":`, tableError.message);
      }
    }
    
    client.release();
    console.log('\n✓ Все проверки завершены');
  } catch (error) {
    console.error('\n✗ Ошибка подключения:', error.message);
    console.error('Стек ошибки:', error.stack);
    
    // Детальная диагностика ошибки подключения
    if (error.code) {
      console.error('\nКод ошибки:', error.code);
      console.error('Возможные причины:');
      
      switch (error.code) {
        case 'ECONNREFUSED':
          console.error('- Сервер БД не запущен или недоступен');
          console.error('- Неправильный порт или хост');
          break;
        case '28P01':
          console.error('- Неверное имя пользователя или пароль');
          break;
        case '3D000':
          console.error('- База данных не существует');
          console.error(`- Проверьте имя БД: ${process.env.DB_NAME || 'не указано'}`);
          break;
        case 'ENOTFOUND':
          console.error('- Сервер БД не найден (проверьте хост)');
          break;
        case 'ETIMEDOUT':
          console.error('- Таймаут подключения (проверьте доступность сервера)');
          break;
        default:
          console.error('- Неизвестная ошибка, проверьте параметры подключения');
      }
    }
  } finally {
    console.log('\nЗавершение работы с пулом соединений');
    await pool.end();
  }
}

testConnection().then(() => {
  console.log('Скрипт завершен');
}).catch(err => {
  console.error('Ошибка выполнения скрипта:', err.message);
});