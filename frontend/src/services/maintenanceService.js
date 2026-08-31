import api from './api';

const maintenanceService = {
  getSchedules: async () => {
    const response = await api.get('/maintenance/schedules');
    return response.data;
  },
  completeTask: async (logData) => {
    const response = await api.post('/maintenance/complete', logData);
    return response.data;
  },
  createSchedule: async (scheduleData) => {
    const response = await api.post('/maintenance/schedule', scheduleData);
    return response.data;
  },
  getLogs: async () => {
    const response = await api.get('/maintenance/logs');
    return response.data;
  },
  deleteLog: async (id) => {
    const response = await api.delete(`/maintenance/logs/${id}`);
    return response.data;
  }
};

export default maintenanceService;

