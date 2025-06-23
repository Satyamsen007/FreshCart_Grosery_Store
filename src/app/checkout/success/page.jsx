'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/features/cartSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const orderId = searchParams.get('order_id');

        // If there's a session ID, verify the payment
        if (sessionId && orderId) {
          const { data } = await axios.post('/api/verify-payment', {
            sessionId,
            orderId
          });

          if (!data.success) {
            toast.error(data.message || 'Payment verification failed');
            router.push('/cart');
            return;
          }
        }

        // Clear the cart
        dispatch(clearCart());
        setIsLoading(false);
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Something went wrong. Please contact support.');
        router.push('/cart');
      }
    };

    verifyPayment();
  }, [dispatch, router, searchParams]);

  const checkmarkVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1,
        delay: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--primaryColor)] dark:border-[#FFB74D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <motion.div
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={checkmarkVariants}
        >
          <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
        </motion.div>
        <motion.h1
          className="text-2xl font-bold text-[var(--textColor)] dark:text-gray-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Order Placed Successfully!
        </motion.h1>
        <motion.p
          className="text-[var(--textColor)]/70 dark:text-gray-300 text-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Awesome! Your order is confirmed and on its way to becoming something special. Keep an eye on your inbox for all the exciting details!
        </motion.p>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={() => router.push('/orders')}
            className="w-full cursor-pointer bg-[var(--primaryColor)] text-white hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
          >
            View Orders
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full cursor-pointer border-[var(--primaryColor)] text-[var(--primaryColor)] hover:bg-[var(--primaryColor)]/10 dark:border-[#FFB74D] dark:text-[#FFB74D] dark:hover:bg-[#FFB74D]/10"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    </div>
  );
}