import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to build query string
const buildQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== '' && !(typeof value === 'number' && isNaN(value)))
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `?${query}` : '';
};

export const fetchBestSellingProducts = createAsyncThunk(
  'products/fetchBestSellingProducts',
  async ({
    page = 1,
    limit = 15,
    rating = undefined,
    offer = '',
    brand = '',
    category = 'all',
    minPrice = undefined,
    maxPrice = undefined,
  }, { rejectWithValue, signal }) => {
    try {
      const params = {
        page,
        limit,
        ...(rating !== undefined && { rating }),
        ...(offer && { offer }),
        ...(brand && { brand }),
        ...(category && category !== 'all' && { category }),
        ...(minPrice !== undefined && { minPrice }),
        ...(maxPrice !== undefined && { maxPrice }),
      };

      const queryString = buildQueryString(params);
      const response = await axios.get(`/api/best-selling-products${queryString}`, { signal });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message || 'Network error' });
    }
  }
);

const initialState = {
  items: [],
  currentPage: 1,
  totalPages: 1,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    rating: undefined,
    offer: '',
    brand: '',
    category: 'all',
    minPrice: undefined,
    maxPrice: undefined,
  }
};

const getBestSellingProductsSlice = createSlice({
  name: 'getBestSellingProducts',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      // Reset to first page when filters change
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      const page = Number(action.payload);
      if (!isNaN(page) && page >= 1) {
        state.currentPage = page;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestSellingProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchBestSellingProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ||
          action.error.message ||
          'Failed to fetch products';
      });
  }
});

export const {
  setFilters,
  resetFilters,
  setPage,
  clearError
} = getBestSellingProductsSlice.actions;

// Selectors
export const selectProducts = (state) => state.getBestSellingProducts.items;
export const selectProductsStatus = (state) => state.getBestSellingProducts.status;
export const selectProductsError = (state) => state.getBestSellingProducts.error;
export const selectCurrentPage = (state) => state.getBestSellingProducts.currentPage;
export const selectTotalPages = (state) => state.getBestSellingProducts.totalPages;
export const selectFilters = (state) => state.getBestSellingProducts.filters;

export default getBestSellingProductsSlice.reducer;