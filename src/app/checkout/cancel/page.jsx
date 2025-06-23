'use client'

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CheckoutCancelPage() {
  const router = useRouter();

  const xCircleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: 180
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <motion.div
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={xCircleVariants}
        >
          <XCircle className="mx-auto h-16 w-16 text-red-500 dark:text-red-400" />
        </motion.div>
        <motion.h1
          className="text-2xl font-bold text-[var(--textColor)] dark:text-gray-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Payment Cancelled
        </motion.h1>
        <motion.p
          className="text-[var(--textColor)]/70 dark:text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Your payment was cancelled. No charges were made to your account.
        </motion.p>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={() => router.push('/cart')}
            className="w-full bg-[var(--primaryColor)] cursor-pointer text-white hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90"
          >
            Return to Cart
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