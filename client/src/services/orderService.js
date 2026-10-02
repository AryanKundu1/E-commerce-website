import api from './api';

export const createOrder = (payload) => api.post('/orders', payload).then((r) => r.data.data);

export const getOrder = (id, signal) => api.get(`/orders/${id}`, { signal }).then((r) => r.data.data);
