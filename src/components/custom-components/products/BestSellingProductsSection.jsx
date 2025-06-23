'use client'

import { useBestSellingProductsRedux } from '@/hooks/useBestSellingProducts';
import { useSession } from 'next-auth/react';
import ProductCardSkeleton from './ProductCardSkeleton';
import ProductCard from './ProductCard';
import { RiArrowRightLine } from 'react-icons/ri';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MdOutlineStar } from 'react-icons/md';

const BestSellingProductsSection = () => {
  const { status } = useSession();
  const router = useRouter()
  const {
    products,
    currentPage,
    loading,
    error
  } = useBestSellingProductsRedux(1, 10);
  const isLoading = loading || status === 'loading'
  return (
    <div className="xl:px-5 py-7 px-3 bg-white dark:bg-gray-900">
      <h2 className="text-[var(--textColor)] dark:text-gray-100 text-2xl max-lg:text-xl font-bold mb-6 xl:mb-8">Best Sellers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 max-lg:mb-14 gap-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : error ? (
          <div className="col-span-full text-center py-10">
            <p className="text-red-500 dark:text-red-400">Error loading products. Please try again later.</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[var(--primaryColor)] hover:bg-[var(--primaryDarkColor)] dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 flex items-center justify-center mb-4">
              <MdOutlineStar className="w-10 h-10 text-[var(--primaryColor)] dark:text-[#FFB74D]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--textColor)] dark:text-gray-100 mb-2">
              No Best Sellers Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              We're still collecting data on our best-selling products. Check back soon to see what's popular!
            </p>
            <Button
              onClick={() => router.push('/products')}
              className="bg-[var(--primaryColor)] cursor-pointer hover:bg-[var(--primaryDarkColor)] dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Browse All Products
            </Button>
          </div>
        ) : (
          products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))
        )}
      </div>
      {!isLoading && products.length > 0 && currentPage > 0 ? (
        <div className="w-full flex justify-center items-center mt-8">
          <button onClick={() => router.push('/products/best-sellers')} className="flex text-lg text-[var(--textColor)] dark:text-gray-100 font-semibold items-center gap-2 cursor-pointer group hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors duration-300">
            Show More <RiArrowRightLine className="group-hover:translate-x-2 duration-300" />
          </button>
        </div>
      ) : isLoading ? (
        <div className="w-full flex justify-center items-center mt-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-md" />
            <Skeleton className="h-6 w-6 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default BestSellingProductsSection;