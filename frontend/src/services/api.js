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

  delete: (url, config = {}) =>
    axios.delete(`${BASE_URL}${url}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
        ...getAuthHeaders()
      }
    })
};

export default api;