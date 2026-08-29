import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from '../../services/maintenanceService';

export const fetchSchedules = createAsyncThunk('maintenance/fetchSchedules', async (_, thunkAPI) => {
  try {
    return await maintenanceService.getSchedules();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules');
  }
});

export const completeTask = createAsyncThunk('maintenance/completeTask', async (logData, thunkAPI) => {
  try {
    return await maintenanceService.completeTask(logData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to complete task');
  }
});

export const createSchedule = createAsyncThunk('maintenance/createSchedule', async (scheduleData, thunkAPI) => {
  try {
    return await maintenanceService.createSchedule(scheduleData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    schedules: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(s => s.id !== action.meta.arg.scheduleId);
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      });
  }
});

export default maintenanceSlice.reducer;
