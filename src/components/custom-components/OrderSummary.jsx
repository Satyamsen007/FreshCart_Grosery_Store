'use client';

import { setPaymentMethod, applyCoupon, removeCoupon } from "@/store/features/cartSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const OrderSummary = ({ subtotal, tax, shipping }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedPayment = useSelector(state => state.cart.selectedPaymentMethod);
  const appliedCoupon = useSelector(state => state.cart.appliedCoupon);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const { data: session } = useSession()
  // Valid coupon codes
  const validCoupons = {
    'FREESHIP': { type: 'free_shipping', discount: shipping },
    'FIRSTORDER': { type: 'free_shipping', discount: shipping },
    'WELCOME50': { type: 'free_shipping', discount: shipping }
  };

  const handleApplyCoupon = () => {
    setError('');
    const coupon = validCoupons[couponCode.toUpperCase()];

    if (!couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    if (!coupon) {
      setError('Invalid coupon code');
      return;
    }

    if (appliedCoupon) {
      setError('Coupon already applied');
      return;
    }

    dispatch(applyCoupon({ code: couponCode.toUpperCase(), ...coupon }));
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setError('');
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(setPaymentMethod(method));
  };

  // Calculate final total based on applied coupon
  const finalShipping = appliedCoupon?.type === 'free_shipping' ? 0 : shipping;
  const finalTotal = subtotal + tax + finalShipping;

  return (
    <div className="bg-[#F8F9FA] p-6 rounded-lg h-fit dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-[var(--textColor)] dark:text-gray-100">Order Summary</h2>
      <div className="border-b border-[var(--textColor)]/15 pb-4 dark:border-gray-700">
        <h3 className="text-[var(--textColor)]/60 text-sm mb-4 dark:text-gray-400">Estimating Shopping and Tax</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--textColor)]/60 dark:text-gray-400">Subtotal</span>
            <span className="text-[var(--textColor)] dark:text-gray-100">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--textColor)]/60 dark:text-gray-400">Tax</span>
            <span className="text-[var(--textColor)] dark:text-gray-100">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--textColor)]/60 dark:text-gray-400">Shipping</span>
            <div className="flex items-center gap-2">
              {appliedCoupon?.type === 'free_shipping' && (
                <span className="text-xs text-green-600 line-through dark:text-green-400">₹{shipping.toFixed(2)}</span>
              )}
              <span className="text-[var(--textColor)] dark:text-gray-100">₹{finalShipping.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between font-medium text-[15px] pt-2">
            <span className="text-[var(--textColor)] dark:text-gray-100">Order Total</span>
            <span className="text-[var(--textColor)] dark:text-gray-100">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="py-4 border-b border-[var(--textColor)]/15 dark:border-gray-700">
        <h3 className="text-[var(--textColor)] font-medium mb-3 dark:text-gray-100">Apply Discount Code</h3>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-md dark:bg-green-900/30">
            <div>
              <span className="text-green-600 font-medium dark:text-green-400">{couponCode}</span>
              <p className="text-sm text-green-600 dark:text-green-400">Free Shipping Applied!</p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 cursor-pointer hover:text-red-600 text-sm font-medium dark:text-red-400"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 max-sm:flex-col">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#E4E7ED] rounded-md text-sm focus:outline-none focus:border-[var(--primaryColor)] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-6 py-2 bg-[var(--primaryColor)] dark:bg-[#FFB74D] cursor-pointer text-white rounded-md hover:bg-[var(--primaryColor)]/80 border dark:border-[#FFB74D] dark:hover:bg-gray-800 transition-all duration-200 max-sm:w-full"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 dark:text-red-400">{error}</p>}
          </>
        )}
      </div>

      <div className="pt-4">
        <h3 className="text-[var(--textColor)] font-medium mb-4 dark:text-gray-100">Payment Methods</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === 'cod'}
              onChange={() => handlePaymentMethodChange('cod')}
              className="w-4 cursor-pointer h-4 accent-[var(--primaryColor)] dark:accent-[#FFB74D] dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-[#FFB74D] dark:checked:border-[#FFB74D]"
            />
            <span className="text-[var(--textColor)]/70 dark:text-gray-300">Cash on Delivery (COD)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={selectedPayment === 'netbanking'}
              onChange={() => handlePaymentMethodChange('netbanking')}
              className="w-4 cursor-pointer h-4 accent-[var(--primaryColor)] dark:accent-[#FFB74D] dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-[#FFB74D] dark:checked:border-[#FFB74D]"
            />
            <span className="text-[var(--textColor)]/70 dark:text-gray-300">Net Banking</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={selectedPayment === 'upi'}
              onChange={() => handlePaymentMethodChange('upi')}
              className="w-4 cursor-pointer h-4 accent-[var(--primaryColor)] dark:accent-[#FFB74D] dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-[#FFB74D] dark:checked:border-[#FFB74D]"
            />
            <span className="text-[var(--textColor)]/70 dark:text-gray-300">UPI Payment</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={selectedPayment === 'card'}
              onChange={() => handlePaymentMethodChange('card')}
              className="w-4 cursor-pointer h-4 accent-[var(--primaryColor)] dark:accent-[#FFB74D] dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-[#FFB74D] dark:checked:border-[#FFB74D]"
            />
            <span className="text-[var(--textColor)]/70 dark:text-gray-300">Credit/Debit Cards</span>
          </label>
        </div>

        <button
          onClick={() => router.push('/checkout')}
          disabled={!selectedPayment || (!session && !session?.user)}
          className="w-full mt-6 py-3 cursor-pointer bg-[var(--primaryColor)] dark:bg-[#FFB74D] text-white rounded-md hover:bg-[var(--primaryColor)]/80 border dark:border-[#FFB74D] dark:hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--primaryColor)] dark:disabled:bg-gray-700 dark:disabled:border-gray-600 dark:disabled:hover:bg-gray-700 dark:disabled:text-gray-400"
        >
          {selectedPayment ? 'Proceed to Checkout' : 'Select Payment Method to Continue'}
        </button>
        {!session && !session?.user && (
          <p className="text-center mt-2 text-sm text-[var(--textColor)]/70 dark:text-gray-400">
            Authentication required to complete your purchase
          </p>
        )}
      </div>
    </div>
  );
}

export default OrderSummary