import api from './api';

export const itemService = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items/add', itemData),
  search: (query) => api.get(`/items?search=${query}`)
};