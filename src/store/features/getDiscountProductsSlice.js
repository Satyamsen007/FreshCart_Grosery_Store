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

export const fetchDiscountProducts = createAsyncThunk(
  'products/fetchDiscountProducts',
  async ({
    page = 1,
    limit = 15,
    rating = undefined,
    offer = '',
    brand = '',
    category = 'all',
    minPrice = undefined,
    maxPrice = undefined
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
        ...(maxPrice !== undefined && { maxPrice })
      };

      const queryString = buildQueryString(params);
      const response = await axios.get(`/api/discount-products${queryString}`, { signal });
      console.log(response);

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
    maxPrice: undefined
  }
};

const getDiscountProductsSlice = createSlice({
  name: 'getDiscountProducts',
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
      .addCase(fetchDiscountProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDiscountProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchDiscountProducts.rejected, (state, action) => {
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
} = getDiscountProductsSlice.actions;

// Selectors
export const selectProducts = (state) => state.getDiscountProducts.items;
export const selectProductsStatus = (state) => state.getDiscountProducts.status;
export const selectProductsError = (state) => state.getDiscountProducts.error;
export const selectCurrentPage = (state) => state.getDiscountProducts.currentPage;
export const selectTotalPages = (state) => state.getDiscountProducts.totalPages;
export const selectFilters = (state) => state.getDiscountProducts.filters;

export default getDiscountProductsSlice.reducer;