import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('wishlist');
    if (serializedState === null) {
      return {
        wishlistItems: [],
        loading: false,
        error: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      wishlistItems: [],
      loading: false,
      error: null,
    };
  }
};

const initialState = loadState();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlistItems.find(
        (wishlistItem) => wishlistItem._id === item._id
      );
      if (!existingItem) {
        state.wishlistItems.push(item);
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(state));
      }
    },
    removeFromWishlist: (state, action) => {
      const itemId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== itemId
      );
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state));
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectWishlistItemCount = (state) => state.wishlist.wishlistItems.length;

export default wishlistSlice.reducer;