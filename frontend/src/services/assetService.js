import api from './api';

const assetService = {
  getAll: async (page = 0, size = 10) => {
    const response = await api.get(`/assets?page=${page}&size=${size}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },
  create: async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response.data;
  },
  update: async (id, assetData) => {
    const response = await api.put(`/assets/${id}`, assetData);
    return response.data;
  },
  decommission: async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getAssetStats: async () => {
    const response = await api.get('/assets/stats');
    return response.data;
  }
};

export default assetService;

