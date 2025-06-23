'use client'

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '@/store/features/wishlistSlice';
import { addToCart } from '@/store/features/cartSlice';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DiscountProductCard from '@/components/custom-components/products/DiscountProductCard';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCardSkeleton from '@/components/custom-components/products/ProductCardSkeleton';
import { GrHomeRounded } from 'react-icons/gr';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems = [], loading } = useSelector((state) => state.wishlist);
  const { data: session, status } = useSession();
  const isLoading = loading || status === 'loading';

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Item removed from wishlist', {
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

  return (
    <>
      {
        isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="w-[30%] mb-6">
              <div className='flex items-center gap-2'>
                <Skeleton className="w-6 h-6 rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-8 w-48 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>
              <Skeleton className="w-full mt-2 h-1 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <ProductCardSkeleton key={item} />
              ))}
            </div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-16 h-16 text-[var(--primaryColor)] dark:text-[#FFB74D] mb-4" />
              </motion.div>
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start adding items you love!</p>
            <Link href="/products">
              <Button className="bg-[var(--primaryColor)] cursor-pointer hover:bg-[var(--primaryColor)]/90 dark:bg-[#FFB74D] dark:hover:bg-[#FFB74D]/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className='flex items-center gap-2 text-sm text-[var(--textColor)] font-medium dark:text-gray-300'>
              <GrHomeRounded className="dark:text-gray-300" />
              <p>/ online-store / wishlist</p>
            </div>
            <div className="w-[30%] max-lg:w-full mb-6 mt-5">
              <div className='flex items-center gap-2'>
                <Heart className="w-6 h-6 text-[var(--textColor)] dark:text-gray-100" />
                <h1 className="text-2xl text-[var(--textColor)] dark:text-gray-100 font-semibold">My Wishlist ({wishlistItems.length} items)</h1>
              </div>
              <span className="block w-full mt-2 h-1 bg-gradient-to-r from-[var(--primaryColor)] dark:from-[#FFB74D] rounded-md to-transparent"></span>
            </div>

            <div className="grid my-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7">
              <AnimatePresence>
                {wishlistItems.map((item) => (
                  <motion.div
                    key={item._id}
                    className="relative"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.3 }
                    }}
                    layout
                  >
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="absolute -left-2 -top-2 z-20 p-2 cursor-pointer bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                    <DiscountProductCard product={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      }
    </>
  );
};

export default WishlistPage;