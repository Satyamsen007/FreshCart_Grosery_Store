import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/productSlice.js'
import appReducer from './features/appSlice.js'
import getAdminProductsReducer from './features/getAdminProductsSlice.js';
import getAllProductsReducer from './features/getAllProductsSlice.js';
import getBestSellingProductsReducer from './features/getBestSellingProductsSlice.js';
import getDiscountProductsReducer from './features/getDiscountProductsSlice.js';
import cartReducer from './features/cartSlice.js';
import wishlistReducer from './features/wishlistSlice.js';
import categoryBasedProductReducer from './features/categoryBasedProductSlice.js';
import addressReducer from './features/addressSlice.js';
import orderReducer from './features/orderSlice.js';
import getAdminOrdersReducer from './features/adminOrdersSlice.js';
import getAdminCustomersReducer from './features/getAdminCustomersSlice';
import authReducer from './features/authSlice.js';
import commentsReducer from './features/commentsSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    app: appReducer,
    getAdminProducts: getAdminProductsReducer,
    getAllProducts: getAllProductsReducer,
    getBestSellingProducts: getBestSellingProductsReducer,
    getDiscountProducts: getDiscountProductsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    categoryBasedProduct: categoryBasedProductReducer,
    address: addressReducer,
    orders: orderReducer,
    getAdminOrders: getAdminOrdersReducer,
    getAdminCustomers: getAdminCustomersReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
