import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assetService from '../../services/assetService';

export const fetchAssets = createAsyncThunk('assets/fetchAll', async (params = 0, thunkAPI) => {
  try {
    const page = typeof params === 'object' && params !== null ? (params.page ?? 0) : (typeof params === 'number' ? params : 0);
    const size = typeof params === 'object' && params !== null ? (params.size ?? 10) : 10;
    return await assetService.getAll(page, size);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch assets');
  }
});

export const fetchAssetById = createAsyncThunk('assets/fetchById', async (id, thunkAPI) => {
  try {
    return await assetService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch asset');
  }
});

export const createAsset = createAsyncThunk('assets/create', async (assetData, thunkAPI) => {
  try {
    await assetService.create(assetData);
    return await assetService.getAll(0);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create asset');
  }
});

export const updateAsset = createAsyncThunk('assets/update', async ({ id, assetData }, thunkAPI) => {
  try {
    await assetService.update(id, assetData);
    return await assetService.getAll(0);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update asset');
  }
});

export const decommissionAsset = createAsyncThunk('assets/decommission', async (id, thunkAPI) => {
  try {
    await assetService.decommission(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to decommission asset');
  }
});

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    items: [],
    selectedAsset: null,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    searchQuery: ''
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    updateAssetHealth: (state, action) => {
      const { assetId, healthScore } = action.payload;
      const asset = state.items.find(a => a.id === assetId || a.id.toString() === assetId.toString());
      if (asset) {
        asset.currentHealth = healthScore;
        if (healthScore < 40) {
          asset.currentStatus = 'UNDER_MAINTENANCE';
        } else if (asset.currentStatus === 'UNDER_MAINTENANCE' && healthScore >= 70) {
          asset.currentStatus = 'ACTIVE';
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.selectedAsset = action.payload;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        if (action.payload?.content) {
          state.items = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
        }
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        if (action.payload?.content) {
          state.items = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
        }
      })
      .addCase(decommissionAsset.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload);
        if (index !== -1) {
          state.items[index].currentStatus = 'DECOMMISSIONED';
        }
      });
  }
});

export const { setSearchQuery, setSelectedAsset, updateAssetHealth } = assetSlice.actions;
export default assetSlice.reducer;

