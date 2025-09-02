// Безопасное хранилище для чувствительных данных
export const secureStorage = {
  // Шифрование данных перед сохранением
  setItem: (key, value) => {
    try {
      // Простое шифрование (в реальном приложении используйте более сложные методы)
      const encryptedValue = btoa(encodeURIComponent(JSON.stringify(value)));
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  },
  
  // Дешифрование данных при получении
  getItem: (key) => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      return JSON.parse(decodeURIComponent(atob(encryptedValue)));
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return null;
    }
  },
  
  // Удаление данных
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Ошибка при удалении данных:', error);
    }
  },
  
  // Очистка всех данных
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Ошибка при очистке данных:', error);
    }
  }
};