import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'updateUserProfile/update',
  async ({ fullName, avatar }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/auth/user/update-profile', { fullName, avatar })
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

// Async thunk for deleting user account
export const deleteUserAccount = createAsyncThunk(
  'updateUserProfile/delete',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/auth/user/delete-account')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account')
    }
  }
)

const initialState = {
  loading: false,
  deleteLoading: false,
  error: null,
  deleteError: null,
}

const updateUserProfileSlice = createSlice({
  name: 'updateUserProfile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.deleteError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Update Profile Cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Account Cases
      .addCase(deleteUserAccount.pending, (state) => {
        state.deleteLoading = true
        state.deleteError = null
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.deleteLoading = false
        state.deleteError = null
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.deleteLoading = false
        state.deleteError = action.payload
      })
  }
})

export const { clearError } = updateUserProfileSlice.actions
export default updateUserProfileSlice.reducer
