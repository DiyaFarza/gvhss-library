import axios from 'axios';

// This picks up the deployed backend URL from an environment variable.
// Locally it falls back to your local backend on port 5000.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: `${baseURL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;