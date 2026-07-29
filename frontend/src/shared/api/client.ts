import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
