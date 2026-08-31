import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    'http://localhost:8080/api'
});

// Add request interceptor only when Axios provides it.
// Jest's automatic axios mock does not provide a real instance.
if (api && api.interceptors && api.interceptors.request) {
  api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  });
}

// Add response interceptor only when Axios provides it.
if (api && api.interceptors && api.interceptors.response) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );
}

export default api;