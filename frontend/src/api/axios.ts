import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for token handling if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle global errors like 401
    return Promise.reject(error);
  }
);

export default api;
