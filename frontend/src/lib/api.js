import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('titan_token');
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for token attachment', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & 403 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Clear token and user storage upon session expiration or invalid credentials
      try {
        localStorage.removeItem('titan_token');
        localStorage.removeItem('titan_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      } catch (e) {
        console.error('Error handling 401 interceptor:', e);
      }
    } else if (status === 403) {
      console.warn('403 Forbidden: User does not have access permission to this resource.');
      window.dispatchEvent(new Event('auth:forbidden'));
    }

    return Promise.reject(error);
  }
);

export default api;
