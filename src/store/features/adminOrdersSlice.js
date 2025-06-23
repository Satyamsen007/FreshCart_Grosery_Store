import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async ({ page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/orders/get-seller-orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/orders/update-order-status`, { orderId, status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ orderId, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/orders/update-payment-status`, { orderId, paymentStatus });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/orders/delete-order?orderId=${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getAdminOrdersSlice = createSlice({
  name: 'getAdminOrders',
  initialState: {
    orders: [],
    currentPage: 1,
    totalPages: 1,
    status: 'idle',
    error: null,
    updatingOrderId: null,
    deletingOrderId: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders || [];
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updatingOrderId = action.meta.arg.orderId;
        state.status = 'loading';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingOrderId = null;
        state.status = 'succeeded';
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            status: action.payload.order.status,
            updatedAt: action.payload.order.updatedAt
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingOrderId = null;
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updatePaymentStatus.pending, (state, action) => {
        state.updatingOrderId = action.meta.arg.orderId;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.updatingOrderId = null;
        state.status = 'succeeded';
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            paymentStatus: action.payload.order.paymentStatus,
            updatedAt: action.payload.order.updatedAt
          };
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.updatingOrderId = null;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteOrder.pending, (state, action) => {
        state.deletingOrderId = action.meta.arg;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deletingOrderId = null;
        state.orders = state.orders.filter(order => order._id !== action.payload.deleteOrderId);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deletingOrderId = null;
        state.error = action.payload?.message || action.error.message;
      });
  }
});

export default getAdminOrdersSlice.reducer;