import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ProductCardSkeleton = () => {
  return (
    <div className="w-full h-fit relative border-1 border-solid border-[var(--primaryColor)] dark:border-gray-600 p-3 rounded-md">
      <div className="absolute right-2">
        <Skeleton className="h-5 w-5 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-full" />
      </div>
      <div>
        <div className="w-28 h-28 mx-auto relative mb-4">
          <Skeleton className="w-full bg-[var(--primaryColor)]/50 dark:bg-gray-700 h-full rounded-sm" />
        </div>
        <div className="mb-2">
          <Skeleton className="h-3 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-1/2 mb-1" />
          <Skeleton className="h-5 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-full mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-24" />
            <Skeleton className="h-3 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-6" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-10" />
            <Skeleton className="h-3 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-8 mt-[2px]" />
          </div>
          <div className="max-sm:hidden">
            <Skeleton className="h-8 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-24 rounded-sm" />
          </div>
        </div>
        <div className="sm:hidden mt-3">
          <Skeleton className="h-10 bg-[var(--primaryColor)]/50 dark:bg-gray-700 w-full rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton;