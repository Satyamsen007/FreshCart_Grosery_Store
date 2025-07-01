'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-md w-full text-center px-4">
        {/* Error Code */}
        <motion.h1
          className="text-9xl font-extrabold text-[#4FBF8B] dark:text-[#4FBF8B] mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold text-[#364153] dark:text-white mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Oops! Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-[#666] dark:text-gray-300 mb-8 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Illustration */}
        <motion.div
          className="mb-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 bg-[#E8F5E9] dark:bg-[#1B5E20] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-20 h-20 text-[#4FBF8B] dark:text-[#81C784]" />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button asChild className="bg-[#4FBF8B] hover:bg-[#3DAE7A] text-white px-6 py-2 rounded-lg transition-colors">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <Button variant="outline" className="border-[#4FBF8B] text-[#4FBF8B] hover:bg-[#E8F5E9] dark:border-[#81C784] dark:text-[#81C784] dark:hover:bg-[#2E7D32]/20 px-6 py-2 rounded-lg transition-colors">
            <Link href="/products" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Browse Products
            </Link>
          </Button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          className="mt-8 text-sm text-[#666] dark:text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Try searching for what you need
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage