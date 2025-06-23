import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch product by category & id
export const fetchProductByCategory = createAsyncThunk(
  "product/fetchByCategory",
  async ({ category }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${category}`);
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categoryBasedProductSlice = createSlice({
  name: "categoryBasedProduct",
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product";
      });
  },
});


export default categoryBasedProductSlice.reducer;
