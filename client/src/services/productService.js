import api from './api';

export const getProducts = (params, signal) =>
  api.get('/products', { params, signal }).then((r) => r.data.data);

export const getFilterOptions = (signal) =>
  api.get('/products/filters', { signal }).then((r) => r.data.data);

export const getProduct = (slug, signal) =>
  api.get(`/products/${slug}`, { signal }).then((r) => r.data.data);
