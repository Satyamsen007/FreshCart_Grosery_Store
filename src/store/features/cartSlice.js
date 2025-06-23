// store/features/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

// Load cart state from localStorage
const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
    return {
      items: savedCart ? JSON.parse(savedCart) : [],
      selectedPaymentMethod: savedPaymentMethod || ''
    };
  }
  return {
    items: [],
    selectedPaymentMethod: ''
  };
};

const cartState = loadCartFromStorage();
const initialState = {
  items: cartState.items,
  totalItems: 0,
  totalAmount: 0,
  selectedPaymentMethod: cartState.selectedPaymentMethod,
  appliedCoupon: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, variantId, quantity } = action.payload;
      const existingItem = state.items.find(item =>
        item.productId === product._id && item.variantId === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const variant = product.variants.find(v => v._id === variantId);
        state.items.push({
          productId: product._id,
          variantId,
          name: product.name,
          image: product.images[0]?.url,
          price: variant.isDiscountActive ? variant.regularPrice - variant.discountPrice : variant.regularPrice,
          quantity,
          variantName: variant.weight
        });
      }

      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateCartItem: (state, action) => {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find(item =>
        item.productId === productId && item.variantId === variantId
      );

      if (item) {
        item.quantity = quantity;
        const { totalItems, totalAmount } = calculateTotals(state.items);
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(item =>
        !(item.productId === productId && item.variantId === variantId)
      );
      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    setPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
      localStorage.setItem('selectedPaymentMethod', action.payload);
    },

    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      localStorage.setItem('appliedCoupon', JSON.stringify(action.payload));
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      localStorage.removeItem('appliedCoupon');
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.selectedPaymentMethod = '';
      state.appliedCoupon = null;
      localStorage.removeItem('cart');
      localStorage.removeItem('selectedPaymentMethod');
      localStorage.removeItem('appliedCoupon');
    }
  }
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  setPaymentMethod,
  applyCoupon,
  removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;