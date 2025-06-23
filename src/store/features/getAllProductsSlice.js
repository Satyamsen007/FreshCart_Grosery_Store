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

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async ({
    page = 1,
    limit = 15,
    sort = '',
    rating = undefined,
    offer = '',
    brand = '',
    category = 'all',
    minPrice = undefined,
    maxPrice = undefined,
    search = ''
  }, { rejectWithValue, signal }) => {
    try {
      const params = {
        page,
        limit,
        ...(sort && { sort }),
        ...(rating !== undefined && { rating }),
        ...(offer && { offer }),
        ...(brand && { brand }),
        ...(category && category !== 'all' && { category }),
        ...(minPrice !== undefined && { minPrice }),
        ...(maxPrice !== undefined && { maxPrice }),
        ...(search && { search })
      };

      const queryString = buildQueryString(params);
      const response = await axios.get(`/api/all-products${queryString}`, { signal });
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
    sort: '',
    rating: undefined,
    offer: '',
    brand: '',
    category: 'all',
    minPrice: undefined,
    maxPrice: undefined,
    search: ''
  }
};

const getAdminProductsSlice = createSlice({
  name: 'getAllProducts',
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
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
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
} = getAdminProductsSlice.actions;

// Selectors
export const selectProducts = (state) => state.getAllProducts.items;
export const selectProductsStatus = (state) => state.getAllProducts.status;
export const selectProductsError = (state) => state.getAllProducts.error;
export const selectCurrentPage = (state) => state.getAllProducts.currentPage;
export const selectTotalPages = (state) => state.getAllProducts.totalPages;
export const selectFilters = (state) => state.getAllProducts.filters;

export default getAdminProductsSlice.reducer;