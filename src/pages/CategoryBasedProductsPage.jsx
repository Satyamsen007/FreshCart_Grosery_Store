'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByCategory } from '@/store/features/categoryBasedProductSlice';
import ProductCard from '@/components/custom-components/products/ProductCard';
import ProductCardSkeleton from '@/components/custom-components/products/ProductCardSkeleton';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CategoryBasedProductsPage = ({ category }) => {
  const dispatch = useDispatch();
  const { status } = useSession();
  const router = useRouter();
  const { product, loading, error } = useSelector(state => state.categoryBasedProduct);

  const iconVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-5, 5, -5],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const ringVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 0.2, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    initial: { boxShadow: "0 0 20px rgba(249, 168, 38, 0.15)" },
    animate: {
      boxShadow: [
        "0 0 20px rgba(249, 168, 38, 0.15)",
        "0 0 30px rgba(249, 168, 38, 0.3)",
        "0 0 20px rgba(249, 168, 38, 0.15)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    if (category) {
      dispatch(fetchProductByCategory({ category }));
    }
  }, [dispatch, category]);

  const decodedCategory = decodeURIComponent(category);

  const formattedCategory = decodedCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const isLoading = loading || status === 'loading';

  return (
    <div className="px-4 py-8 w-[90%] mx-auto dark:bg-gray-900">
      {
        isLoading ? (
          <div className="mb-5 w-[20%]">
            <Skeleton className="h-7 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-48 mb-1" />
            <Skeleton className="w-full bg-[var(--primaryColor)]/50 dark:bg-gray-700 h-1 rounded-md" />
          </div>
        ) : (
          <div className='mb-5 w-fit'>
            <h1 className="text-2xl font-semibold text-[#364153] dark:text-gray-100 mb-1">{formattedCategory} Products</h1>
            <span className="block w-full h-1 bg-gradient-to-r from-[#4FBF8B] dark:from-[#FFB74D] rounded-md to-transparent"></span>
          </div>
        )
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 max-lg:mb-14 gap-4">
        {isLoading ? (
          Array.from({ length: 20 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <PackageX className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--textColor)] dark:text-gray-100 mb-2">Oops! Something went wrong</h3>
            <p className="text-[var(--textColor)]/60 dark:text-gray-400 text-center mb-6">We couldn't load the products. Please try again later.</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[var(--primaryColor)] hover:bg-[var(--primaryDarkColor)] dark:bg-gray-700 dark:hover:bg-gray-600 px-6"
            >
              Try Again
            </Button>
          </div>
        ) : product && product.length > 0 ? (
          product.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-8 group">
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-[#4FBF8B]/10 to-[#4FBF8B]/20 dark:from-orange-900/20 dark:to-orange-800/30 rounded-full flex items-center justify-center shadow-lg shadow-[#4FBF8B]/20 dark:shadow-orange-900/10"
                variants={glowVariants}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                >
                  <PackageX className="w-16 h-16 text-[#4FBF8B] dark:text-[#FFB74D]" />
                </motion.div>
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full bg-[#4FBF8B]/20 dark:bg-orange-800/40 blur-sm"
                variants={ringVariants}
                initial="initial"
                animate="animate"
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#4FBF8B]/20 dark:bg-orange-800/40 blur-sm"
                variants={ringVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 1.5 }}
              />
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#4FBF8B] to-[#364153] dark:from-[#FFB74D] dark:to-[#F9A826] bg-clip-text text-transparent">
                Coming Soon!
              </h3>
              <p className="text-[#364153]/80 dark:text-gray-300 text-lg">
                We're currently stocking up the <span className="font-semibold text-[#4FBF8B] dark:text-[#FFB74D]">{formattedCategory}</span> section
              </p>
              <p className="text-[#364153]/60 dark:text-gray-400">
                Stay tuned for exciting new products!
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push('/products')}
                  className="bg-gradient-to-r from-[#4FBF8B] to-[#364153] dark:from-[#FFB74D] dark:to-[#F9A826] text-white hover:opacity-90 transition-all duration-300 px-8 py-2.5 text-base font-medium shadow-lg shadow-[#4FBF8B]/20 dark:shadow-orange-900/20 cursor-pointer"
                >
                  Discover More Products
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="border-2 border-[#4FBF8B] dark:border-[#FFB74D] text-[#4FBF8B] dark:text-[#FFB74D] hover:bg-[#4FBF8B]/5 dark:hover:bg-orange-900/20 px-8 py-2.5 text-base font-medium transition-all duration-300 cursor-pointer"
                >
                  Back to Home
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryBasedProductsPage;