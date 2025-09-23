//https://github.com/xJleSx
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Время запроса истекло'));
    }
    
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Произошла ошибка на сервере';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Не удалось подключиться к серверу'));
    } else {
      return Promise.reject(new Error('Ошибка при настройке запроса'));
    }
  }
);

export default api;