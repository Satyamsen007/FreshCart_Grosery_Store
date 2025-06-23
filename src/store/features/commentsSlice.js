import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

// Async thunks
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ productId, comment, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/products/reviews`, {
        comment,
        rating,
        productId
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add comment');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ reviewId, productId, reviewComment, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/products/reviews/${reviewId}?productId=${productId}`, {
        reviewComment,
        rating,
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update comment');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/products/reviews/${reviewId}?productId=${productId}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async ({ commentId, userId }) => {
    try {
      const response = await axios.post(`/api/products/reviews/${commentId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like comment');
    }
  }
);

export const unlikeComment = createAsyncThunk(
  'comments/unlikeComment',
  async ({ commentId, userId }) => {
    try {
      const response = await axios.post(`/api/products/reviews/${commentId}/unlike`, {
        userId,
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unlike comment');
    }
  }
);

const initialState = {
  comments: [],
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  likeLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addLoading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload?.message || 'Failed to add comment';
      })
      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || 'Failed to update comment';
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.reviewId
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.error || 'Failed to delete comment';
      })
      // Like Comment
      .addCase(likeComment.pending, (state) => {
        state.likeLoading = true;
        state.error = null;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.likeLoading = false;
        const { commentId, userId } = action.payload;
        const review = state.comments.find(review => review._id === commentId);
        if (review) {
          if (!review.likes) {
            review.likes = [];
          }
          if (!review.likes.includes(userId)) {
            review.likes.push(userId);
          }
        }
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.likeLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message || 'Failed to like comment');
      })
      // Unlike Comment
      .addCase(unlikeComment.pending, (state) => {
        state.likeLoading = true;
        state.error = null;
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        state.likeLoading = false;
        const { commentId, userId } = action.payload;
        const review = state.comments.find(review => review._id === commentId);
        if (review && review.likes) {
          review.likes = review.likes.filter(id => id !== userId);
        }
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.likeLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message || 'Failed to unlike comment');
      });
  },
});

export const { setComments, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;