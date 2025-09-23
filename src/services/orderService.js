//https://github.com/xJleSx
import api from './api';

export const orderService = {
  create: (orderData) => api.post('/orders/create', orderData),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getPurchaseHistory: (userId) => api.get(`/purchase-history/user/${userId}`)
};