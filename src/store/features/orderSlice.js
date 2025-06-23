import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/orders/get-buyer-orders');

      if (!data.success) {
        return rejectWithValue(data.message);
      }
      console.log(data.orders);
      return data.orders;
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

// Async thunk for cancelling order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/orders/cancel', { orderId });

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.order;
    } catch (error) {
      return rejectWithValue('Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
    cancellingOrderId: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state, action) => {
        state.cancellingOrderId = action.meta.arg;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancellingOrderId = null;
        const index = state.items.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancellingOrderId = null;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;