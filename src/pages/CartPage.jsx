'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '@/store/features/cartSlice';
import {  ShoppingBag } from 'lucide-react';
import { GrHomeRounded } from 'react-icons/gr';
import EmptyCartUi from '@/components/custom-components/EmptyCartUi';
import { AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import CartItem from '@/components/custom-components/CartItem';
import OrderSummary from '@/components/custom-components/OrderSummary';
import CartPageSkeleton from '@/components/custom-components/skeletons/CartPageSkeleton';

const CartPage = () => {
  const dispatch = useDispatch();
  // Safely access Redux state with fallbacks
  const { items: cartItems = [] } = useSelector(state => state?.cart || {});
  const { status } = useSession();

  // Memoized calculations
  const { subtotal, tax, shipping, total } = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const shipping = cartItems.length > 0 ? 40.00 : 0;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  }, [cartItems]);

  const handleQuantityChange = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({
      productId,
      variantId,
      quantity: newQuantity
    }));
    
    toast.success('Cart updated successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  const handleRemoveItem = (productId, variantId) => {
    dispatch(removeFromCart({
      productId,
      variantId
    }));
    toast.success('Item removed from cart', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  // Show skeleton loader while loading
  if (status === 'loading') {
    return <CartPageSkeleton />;
  }

  if (cartItems.length === 0) {
    return <EmptyCartUi />;
  }

  return (
    <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 max-md:px-0 py-8">
      <div className='flex items-center max-md:justify-center gap-2 text-sm text-[var(--textColor)] font-medium dark:text-gray-300'>
        <GrHomeRounded />
        <p>/ online-store / cart</p>
      </div>
      <div className='mt-5 w-fit max-md:mx-auto'>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[var(--textColor)] dark:text-gray-100" />
          <h1 className="text-2xl max-md:text-xl font-semibold text-[var(--textColor)] mb-1 dark:text-gray-100">Shopping Cart ({cartItems.length} items)</h1>
        </div>
        <span className="block w-full h-1 bg-gradient-to-r from-[var(--primaryColor)] dark:from-[#FFB74D] rounded-md to-transparent"></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-8">
        {/* Cart Items */}
        <div className="bg-white rounded-lg p-6 max-md:p-0 max-md:dark:bg-gray-900 dark:bg-gray-800">
          <div className="hidden md:flex justify-between px-4 w-full items-center text-sm font-medium text-[var(--textColor)]/70 dark:text-gray-400">
            <div className="w-[45%]">Product</div>
            <div className="w-[15%] text-center">Price</div>
            <div className="w-[20%] text-center">Quantity</div>
            <div className="w-[20%] text-center">Subtotal</div>
          </div>

          <div className='max-h-[500px] overflow-y-auto srollbar-hidden'>
            <AnimatePresence>
              {cartItems.slice().reverse().map((item) => (
                <CartItem
                  key={`${item.productId}-${item.variantId}`}
                  product={item}
                  onQuantityChange={(newQuantity) => handleQuantityChange(item.productId, item.variantId, newQuantity)}
                  onRemove={() => handleRemoveItem(item.productId, item.variantId)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
        />
      </div>
    </div>
  );
};

// Export with dynamic import for client-side only rendering
export default dynamic(() => Promise.resolve(React.memo(CartPage)), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primaryColor)]"></div>
    </div>
  )
});