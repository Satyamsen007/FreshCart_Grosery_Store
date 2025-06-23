import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching customers
export const fetchAdminCustomers = createAsyncThunk(
  'getAdminCustomers/fetchCustomers',
  async ({ page = 1, limit = 5 }) => {
    try {
      const response = await axios.get(`/api/admin-customers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch customers';
    }
  }
);

const initialState = {
  items: [],
  totalPages: 1,
  currentPage: 1,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const getAdminCustomersSlice = createSlice({
  name: 'getAdminCustomers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.customers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchAdminCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getAdminCustomersSlice.reducer; 