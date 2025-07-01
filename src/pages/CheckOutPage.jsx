'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { GrHomeRounded } from "react-icons/gr";
import { Home, Briefcase, Building2, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { fetchAddresses } from '@/store/features/addressSlice';
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios';

const CheckOutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status: sessionStatus } = useSession();
  // Safely access Redux state with fallbacks
  const cartItems = useSelector(state => state?.cart?.items || []);
  const selectedPayment = useSelector(state => state?.cart?.selectedPaymentMethod || '');
  const appliedCoupon = useSelector(state => state?.cart?.appliedCoupon || null);
  const { addresses = [], loading: addressesLoading = false } = useSelector(state => state?.address || {});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (session) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, session]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];
      setSelectedAddress(primaryAddress);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method in cart');
      router.push('/cart');
    }
  }, [selectedPayment, cartItems.length, router]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = 40;
  const tax = subtotal * 0.10; // 10% tax
  const finalDeliveryCharge = appliedCoupon?.type === 'free_shipping' ? 0 : deliveryCharge;
  const finalAmount = subtotal + tax + finalDeliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method in cart');
      router.push('/cart');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          variantId: item.variantId
        })),
        totalAmount: finalAmount,
        paymentMethod: selectedPayment,
        shippingInfo: {
          fullName: selectedAddress.contact.name,
          phone: selectedAddress.contact.phone,
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode
        }
      };

      // Create order
      const { data: orderJson } = await axios.post('/api/orders/create', orderData);

      if (!orderJson.success) {
        toast.error(orderJson.message || 'Failed to create order');
        setPlacingOrder(false);
        return;
      }

      // If payment method is COD, redirect to success page
      if (selectedPayment === 'cod') {
        router.push('/checkout/success');
        return;
      }

      // For online payment, create Stripe checkout session
      const { data: checkoutJson } = await axios.post('/api/create-checkout-session', {
        items: cartItems.map(item => ({
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        orderId: orderJson.order._id,
      });

      if (!checkoutJson.success) {
        toast.error(checkoutJson.message || 'Failed to create payment session');
        setPlacingOrder(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutJson.url;

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Something went wrong. Please try again.');
      setPlacingOrder(false);
    }
  };

  const isLoading = addressesLoading || sessionStatus === 'loading';

  if (isLoading) {
    return (
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm">
          <Skeleton className="w-4 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-full" />
          <Skeleton className="w-32 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
        </div>

        <Skeleton className="w-48 h-8 bg-[var(--primaryColor)]/50 dark:bg-gray-700 mt-5 rounded" />

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mt-8">
          {/* Shipping Information Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Skeleton className="w-48 h-6 bg-[var(--primaryColor)]/50 dark:bg-gray-700 mb-6 rounded" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border-2 p-4 rounded-lg">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-4 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-full mt-1" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-full" />
                        <Skeleton className="w-24 h-5 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                      </div>
                      <Skeleton className="w-32 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                      <Skeleton className="w-40 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                      <Skeleton className="w-36 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                      <Skeleton className="w-28 h-3 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
              <Skeleton className="w-full h-10 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Skeleton className="w-48 h-6 bg-[var(--primaryColor)]/50 dark:bg-gray-700 mb-6 rounded" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-20 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-32 h-5 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                    <Skeleton className="w-24 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                    <Skeleton className="w-28 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}

              <div className="border-t dark:border-gray-700 pt-4 mt-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="w-24 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                    <Skeleton className="w-20 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                  <Skeleton className="w-16 h-5 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                  <Skeleton className="w-24 h-5 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="w-28 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                  <Skeleton className="w-20 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
                </div>
                <Skeleton className="w-full h-10 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 py-8">
      <div className='flex items-center gap-2 text-sm text-[var(--textColor)] dark:text-gray-300 font-medium'>
        <GrHomeRounded />
        <p>/ online-store / checkout</p>
      </div>

      <div className='mt-5'>
        <h1 className="text-2xl font-semibold text-[var(--textColor)] dark:text-gray-100 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Shipping Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium text-[var(--textColor)] dark:text-gray-100 mb-6">Select Delivery Address</h2>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--textColor)]/70 dark:text-gray-400 mb-4">No addresses found</p>
                <Button
                  onClick={() => router.push('/delivery-addresses')}
                  className="bg-[var(--primaryColor)] cursor-pointer text-white hover:bg-[var(--primaryColor)]/80 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/80 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Address
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedAddress?._id === address._id
                      ? 'border-[var(--primaryColor)] dark:border-[#FFB74D] bg-[var(--primaryColor)]/5 dark:bg-[#FFB74D]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?._id === address._id}
                        onChange={() => handleAddressSelect(address)}
                        className="mt-1 w-4 h-4 accent-[var(--primaryColor)] dark:accent-[#FFB74D]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 rounded-full">
                            {address.type === 'home' ? (
                              <Home className="w-4 h-4 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                            ) : address.type === 'work' ? (
                              <Briefcase className="w-4 h-4 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                            ) : (
                              <Building2 className="w-4 h-4 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
                            )}
                          </div>
                          <h3 className="font-medium text-[var(--textColor)] dark:text-gray-200 capitalize">
                            {address.type}
                            {address.isPrimary && (
                              <span className="ml-2 text-xs bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 text-[var(--primaryColor)] dark:text-[#FFB74D] px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm text-[var(--textColor)]/70 dark:text-gray-400">
                          <p className="font-medium text-[var(--textColor)] dark:text-gray-200">{address.contact.name}</p>
                          <p className="text-[var(--primaryColor)] dark:text-[#FFB74D]">{address.contact.phone}</p>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} - {address.postalCode}</p>
                          <p className="text-xs">{address.contact.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => router.push('/delivery-addresses')}
                  className="w-full bg-transparent cursor-pointer border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] text-[var(--primaryColor)] dark:text-[#FFB74D] hover:bg-[var(--primaryColor)]/5 dark:hover:bg-[#FFB74D]/5 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Address
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-fit shadow-sm">
            <h2 className="text-xl font-medium text-[var(--textColor)] dark:text-gray-100 mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                  <div className="h-20 w-20 relative">
                    <Image
                      src={item.image || '/placeholder-product.png'}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--textColor)] dark:text-gray-200">{item.name}</h3>
                    <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-[var(--textColor)] dark:text-gray-200">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t dark:border-gray-700 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--textColor)]/70 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-[var(--textColor)] dark:text-gray-200">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--textColor)]/70 dark:text-gray-400">Tax (10%)</span>
                  <span className="font-medium text-[var(--textColor)] dark:text-gray-200">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--textColor)]/70 dark:text-gray-400">Delivery Charge</span>
                  <div className="flex items-center gap-2">
                    {appliedCoupon?.type === 'free_shipping' && (
                      <span className="text-xs text-green-600 line-through dark:text-green-400">₹{deliveryCharge.toFixed(2)}</span>
                    )}
                    <span className="font-medium text-[var(--textColor)] dark:text-gray-200">₹{finalDeliveryCharge.toFixed(2)}</span>
                  </div>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Coupon Applied</span>
                    <span className="font-medium text-green-600 dark:text-green-400">-₹{deliveryCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium pt-2 border-t dark:border-gray-700">
                  <span className="text-[var(--textColor)] dark:text-gray-200">Total</span>
                  <span className="text-[var(--primaryColor)] dark:text-[#FFB74D]">₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-[var(--textColor)]/70 dark:text-gray-400">Payment Method</span>
                  <span className="font-medium text-[var(--textColor)] dark:text-gray-200 capitalize">{selectedPayment}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || placingOrder}
                  className="w-full cursor-pointer bg-[var(--primaryColor)] dark:bg-[#FFB74D] text-white hover:bg-[var(--primaryColor)]/80 dark:hover:bg-[#FFB74D]/80 border dark:border-[#FFB74D] disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:hover:bg-gray-300 dark:disabled:hover:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {placingOrder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    `Place Order (₹${finalAmount.toFixed(2)})`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export with dynamic import for client-side only rendering
export default dynamic(() => Promise.resolve(CheckOutPage), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primaryColor)]"></div>
    </div>
  )
});