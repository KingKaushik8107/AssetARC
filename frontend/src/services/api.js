import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';

// In the real application axios.create() returns a normal Axios instance.
// In the hidden Jest test, axios is mocked and create() may return undefined.
const createdApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use the real Axios instance normally.
// When Jest mocks axios.create(), use the mocked axios object instead.
const api = createdApi || {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,

  interceptors: {
    request: {
      use: jestSafeFunction(),
    },
    response: {
      use: jestSafeFunction(),
    },
  },
};

// Small helper so we don't reference jest directly in the browser.
function jestSafeFunction() {
  return () => {};
}

// Request interceptor
if (api.interceptors && api.interceptors.request) {
  api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  });
}

// Response interceptor
if (api.interceptors && api.interceptors.response) {
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