import axios from 'axios';

const configuredBase = import.meta.env.VITE_API_BASE_URL || '';
const normalizedBase = configuredBase.endsWith('/') ? configuredBase.slice(0, -1) : configuredBase;

const api = axios.create({
  baseURL: normalizedBase || '',
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
