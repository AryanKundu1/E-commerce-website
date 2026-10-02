import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

const RETRY_STATUS = [502, 503, 504];
const MAX_RETRIES = 5;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.code === 'ERR_CANCELED') return Promise.reject(err);

   
    const config = err.config;
    const serverNotReady =
      !err.response || err.code === 'ECONNABORTED' || RETRY_STATUS.includes(err.response.status);

    if (config && config.method === 'get' && serverNotReady) {
      config.__retries = (config.__retries || 0) + 1;
      if (config.__retries <= MAX_RETRIES) {
        await wait(3000);
        return api(config);
      }
    }

    let message = 'Something went wrong. Please try again.';
    if (err.code === 'ECONNABORTED') {
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
