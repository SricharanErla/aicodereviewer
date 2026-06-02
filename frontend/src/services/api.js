import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = rawBaseUrl ? `${rawBaseUrl.replace(/\/+$/, '')}/api` : '/api';

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong while contacting the review API.';

    return Promise.reject(new Error(message));
  }
);

export default api;
