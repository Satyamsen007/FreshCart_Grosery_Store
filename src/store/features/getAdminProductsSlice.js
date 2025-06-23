import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async ({ page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin-products?page=${page}&limit=${limit}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const getAdminProductsSlice = createSlice({
  name: 'getAdminProducts',
  initialState: {
    items: [],
    currentPage: 1,
    totalPages: 1,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products || [];
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      });
  }
});

export default getAdminProductsSlice.reducer;