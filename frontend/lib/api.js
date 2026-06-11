import axios from 'axios';
import mockApi from './mockApi';

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === 'mock';

let API;
if (USE_MOCK) {
  API = mockApi;
} else {
  API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  });
  // Add token to requests
  API.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  // Handle auth errors
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}

export default API;
