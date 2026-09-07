import api from './api';

const healthService = {
  // POST /api/health/record (Technician verified diagnostic health recording)
  recordHealth: async (metricData) => {
    const response = await api.post('/health/record', metricData);
    return response.data;
  },

  // PUT /api/health/record (Technician/Admin verified diagnostic health update)
  updateHealth: async (metricData) => {
    const response = await api.put('/health/record', metricData);
    return response.data;
  },

  // POST /api/monitoring/metrics (Sensor & live condition telemetry ingestion)
  recordMetric: async (metricData) => {
    const response = await api.post('/monitoring/metrics', metricData);
    return response.data;
  },

  // PUT /api/monitoring/metrics (Sensor & live condition telemetry update)
  updateMetric: async (metricData) => {
    const response = await api.put('/monitoring/metrics', metricData);
    return response.data;
  }
};

export default healthService;
