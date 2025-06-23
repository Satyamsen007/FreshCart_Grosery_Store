import { Skeleton } from "@/components/ui/skeleton";

const CartPageSkeleton = () => {
  return (
    <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 max-md:px-0 py-8">
      {/* Breadcrumb Skeleton */}
      <div className='flex items-center max-md:justify-center gap-2'>
        <Skeleton className="w-4 h-4 rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
        <Skeleton className="w-32 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
      </div>

      {/* Header Skeleton */}
      <div className='mt-5 w-fit max-md:mx-auto'>
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
          <Skeleton className="w-48 h-8 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
        </div>
        <Skeleton className="w-32 h-1 mt-1 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8 mt-8">
        {/* Cart Items Skeleton */}
        <div className="bg-white rounded-lg p-6 max-md:p-0 dark:bg-gray-800">
          {/* Desktop Headers */}
          <div className="hidden md:flex justify-between px-4 w-full items-center">
            <Skeleton className="w-[45%] h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <Skeleton className="w-[15%] h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <Skeleton className="w-[20%] h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <Skeleton className="w-[20%] h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-2 border-[var(--primaryColor)] dark:border-gray-700 w-full px-4 py-3 rounded-2xl relative dark:bg-gray-800">
                {/* Mobile View Skeleton */}
                <div className="md:hidden flex flex-col gap-3">
                  <div className="flex relative items-center gap-3">
                    <Skeleton className="h-20 w-20 rounded-lg bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-32 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                      <Skeleton className="w-24 h-3 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                      <Skeleton className="w-20 h-3 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-24 h-8 rounded-xl bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                    <Skeleton className="w-16 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  </div>
                </div>

                {/* Desktop View Skeleton */}
                <div className="hidden md:flex justify-between items-center">
                  <div className="w-[45%]">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-20 w-20 rounded-lg bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                      <div className="space-y-2">
                        <Skeleton className="w-32 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                        <Skeleton className="w-24 h-3 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                      </div>
                    </div>
                  </div>
                  <div className="w-[15%]">
                    <Skeleton className="w-16 h-4 rounded mx-auto bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  </div>
                  <div className="w-[20%]">
                    <Skeleton className="w-24 h-8 rounded-xl mx-auto bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  </div>
                  <div className="w-[20%]">
                    <div className="flex items-center justify-center gap-7">
                      <Skeleton className="w-16 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                      <Skeleton className="w-6 h-6 rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-[#F8F9FA] p-6 rounded-lg h-fit dark:bg-gray-800">
          <Skeleton className="w-48 h-8 rounded mb-6 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />

          <div className="border-b border-[var(--textColor)]/15 pb-4 dark:border-gray-700">
            <Skeleton className="w-40 h-4 rounded mb-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between">
                  <Skeleton className="w-20 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="w-16 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>

          <div className="py-4 border-b border-[var(--textColor)]/15 dark:border-gray-700">
            <Skeleton className="w-40 h-5 rounded mb-3 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <div className="flex gap-2 max-sm:flex-col">
              <Skeleton className="flex-1 h-10 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              <Skeleton className="w-20 h-10 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            </div>
          </div>

          <div className="pt-4">
            <Skeleton className="w-36 h-5 rounded mb-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="w-32 h-4 rounded bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                </div>
              ))}
            </div>
            <Skeleton className="w-full h-12 rounded mt-6 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );

}

export default CartPageSkeleton