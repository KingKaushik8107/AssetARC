import api from './api';

const healthService = {
  // POST /api/health/record (Technician verified diagnostic health recording)
  recordHealth: async (metricData) => {
    const response = await api.post('/health/record', metricData);
    return response.data;
  },

  // POST /api/monitoring/metrics (Sensor & live condition telemetry ingestion)
  recordMetric: async (metricData) => {
    const response = await api.post('/monitoring/metrics', metricData);
    return response.data;
  }
};

export default healthService;
