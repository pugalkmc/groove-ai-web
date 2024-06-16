import axios from 'axios';

const BASE_URL = 'http://localhost:3001'; // Replace with your backend URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error('Failed to fetch JWT token:', error);
  }
  return config;
});

export default axiosInstance;