import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://app.sipandsavvy.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hasToken = localStorage.getItem('auth_token');
      const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/';
      
      // Only clear token if we had one AND we're not on the login page
      if (hasToken && !isLoginPage) {
        console.log('401 Unauthorized - clearing expired token');
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      }
      // Don't clear token if we're on login page or if there was no token
    }
    return Promise.reject(error);
  }
);

export default api;
