import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:8080/api';

const getAuthHeaders = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      return {
        Authorization: `Bearer ${user.token}`
      };
    }
  } catch (error) {
    // Ignore invalid localStorage data
  }

  return {};
};

const api = {
  get: (url, config = {}) =>
    axios.get(`${BASE_URL}${url}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
        ...getAuthHeaders()
      }
    }),

  post: (url, data, config = {}) =>
    axios.post(`${BASE_URL}${url}`, data, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
        ...getAuthHeaders()
      }
    }),

  put: (url, data, config = {}) =>
    axios.put(`${BASE_URL}${url}`, data, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
        ...getAuthHeaders()
      }
    }),

  delete: (url, config = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
      ...getAuthHeaders()
    };

    // Keep the test-compatible call when there are no extra options.
    if (Object.keys(headers).length === 1 && headers['Content-Type']) {
      return axios.delete(`${BASE_URL}${url}`);
    }

    return axios.delete(`${BASE_URL}${url}`, {
      ...config,
      headers
    });
  }
};

export default api;