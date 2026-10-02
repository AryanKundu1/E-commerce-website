import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = 'Something went wrong. Please try again.';
    if (err.code === 'ERR_CANCELED') {
      return Promise.reject(err);
    } else if (err.code === 'ECONNABORTED') {
      message = 'The server took too long to respond. Please try again.';
    } else if (!err.response) {
      message = 'Unable to reach the server. Check your connection and try again.';
    } else if (err.response.data?.message) {
      message = err.response.data.message;
    }
    const error = new Error(message);
    error.code = err.code;
    error.status = err.response?.status;
    return Promise.reject(error);
  }
);

export default api;
