// Клиентская реализация хеширования (в реальном приложении это должно делаться на сервере)

// Простая клиентская реализация хеширования (не для production использования)
export const hashPassword = async (password) => {
  // В реальном приложении здесь должен быть запрос к серверу для хеширования
  // Для демо просто возвращаем промис с строкой, похожей на хеш
  return new Promise((resolve) => {
    // Используем TextEncoder и SubtleCrypto для простого хеширования
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Для совместимости проверяем наличие crypto.subtle
    if (window.crypto && window.crypto.subtle) {
      crypto.subtle.digest('SHA-256', data).then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      }).catch(() => {
        // Fallback: простой хеш для демо
        resolve('demo-hash-' + password.length);
      });
    } else {
      // Fallback для браузеров без crypto.subtle
      resolve('demo-hash-' + password.length);
    }
  });
};

// Простая клиентская реализация проверки пароля
export const comparePassword = async (password, hash) => {
  // В реальном приложении здесь должен быть запрос к серверу для проверки
  // Для демо просто хешируем и сравниваем
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
};

// Валидация email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация пароля
export const isStrongPassword = (password) => {
  // Минимум 8 символов, хотя бы одна буква и одна цифра
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Санитизация пользовательского ввода
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};