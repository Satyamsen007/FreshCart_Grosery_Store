import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk for fetching user data
export const getAuthUser = createAsyncThunk(
  'auth/getAuthUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/auth/user')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data')
    }
  }
)

const initialState = {
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getAuthUser
      .addCase(getAuthUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Export actions
export const { clearUser } = authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

// Export reducer
export default authSlice.reducer