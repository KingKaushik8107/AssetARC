import axios from 'axios';

const assetService = {

  getAll: async (page = 0, size = 10) => {
    const response = await axios.get(
      `/assets?page=${page}&size=${size}`
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/assets/${id}`);
    return response.data;
  },

  create: async (assetData) => {
    const response = await axios.post(
      '/assets',
      assetData
    );

    return response.data;
  },

  update: async (id, assetData) => {
    const response = await axios.put(
      `/assets/${id}`,
      assetData
    );

    return response.data;
  },

  decommission: async (id) => {
    const response = await axios.delete(
      `/assets/${id}`
    );

    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(
      '/dashboard/stats'
    );

    return response.data;
  },

  getAssetStats: async () => {
    const response = await axios.get(
      '/assets/stats'
    );

    return response.data;
  }
};

export default assetService;