import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch product by category & id
export const fetchProductByCategoryAndId = createAsyncThunk(
  "product/fetchByCategoryAndId",
  async ({ productCategory, productId }, { rejectWithValue }) => {
    try {
      const encodedCategory = encodeURIComponent(productCategory);
      const encodedId = encodeURIComponent(productId);
      const response = await axios.get(`/api/product/${encodedCategory}/${encodedId}`);

      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByCategoryAndId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByCategoryAndId.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductByCategoryAndId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product";
      });
  },
});


export default productSlice.reducer;
