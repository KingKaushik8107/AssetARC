import axios from 'axios';

const maintenanceService = {

  getSchedules: async () => {
    const response = await axios.get(
      '/maintenance/schedules'
    );

    return response.data;
  },

  completeTask: async (logData) => {
    const response = await axios.post(
      '/maintenance/complete',
      logData
    );

    return response.data;
  },

  createSchedule: async (scheduleData) => {
    const response = await axios.post(
      '/maintenance/schedule',
      scheduleData
    );

    return response.data;
  },

  getLogs: async () => {
    const response = await axios.get(
      '/maintenance/logs'
    );

    return response.data;
  },

  deleteLog: async (id) => {
    const response = await axios.delete(
      `/maintenance/logs/${id}`
    );

    return response.data;
  }
};

export default maintenanceService;