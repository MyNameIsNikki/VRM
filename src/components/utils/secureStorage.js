// Безопасное хранилище для чувствительных данных
export const secureStorage = {
  setItem: (key, value) => {
    try {
      console.log(`secureStorage.setItem: key=${key}, value=`, value); // Отладка
      const encryptedValue = btoa(encodeURIComponent(JSON.stringify(value)));
      localStorage.setItem(key, encryptedValue);
      console.log(`secureStorage.setItem: saved key=${key}, encryptedValue=${encryptedValue}`); // Отладка
    } catch (error) {
      console.error(`secureStorage.setItem: error for key=${key}, error=`, error);
    }
  },

  getItem: (key) => {
    try {
      const encryptedValue = localStorage.getItem(key);
      console.log(`secureStorage.getItem: key=${key}, encryptedValue=${encryptedValue}`); // Отладка
      if (!encryptedValue) {
        console.warn(`secureStorage.getItem: no value found for key=${key}`);
        return null;
      }
      // Проверка валидности base64
      if (!/^[A-Za-z0-9+/=]+$/.test(encryptedValue)) {
        console.error(`secureStorage.getItem: invalid base64 format for key=${key}`);
        return null;
      }
      const decodedValue = JSON.parse(decodeURIComponent(atob(encryptedValue)));
      console.log(`secureStorage.getItem: retrieved key=${key}, value=`, decodedValue); // Отладка
      return decodedValue;
    } catch (error) {
      console.error(`secureStorage.getItem: error for key=${key}, error=`, error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      console.log(`secureStorage.removeItem: key=${key}`); // Отладка
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`secureStorage.removeItem: error for key=${key}, error=`, error);
    }
  },

  clear: () => {
    try {
      console.log('secureStorage.clear called'); // Отладка
      localStorage.clear();
    } catch (error) {
      console.error('secureStorage.clear: error=', error);
    }
  },
};