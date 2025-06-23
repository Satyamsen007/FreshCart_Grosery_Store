'use client';

import React from 'react';
import { FaSearch, FaSadTear, FaShoppingBasket } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NoProductsFoundUi = ({ handleResetFilters }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center pb-5 px-4 text-center">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-[var(--primaryLightColor)] dark:bg-gray-800 flex items-center justify-center">
          <FaShoppingBasket className="text-6xl text-[var(--primaryColor)] dark:text-[#FFB74D]" />
          <FaSadTear className="absolute bottom-0 right-0 text-4xl text-yellow-400 dark:text-yellow-500" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-[var(--textColor)] dark:text-gray-200 mb-4">Oops! Empty Aisles</h2>

      <p className="text-lg text-[var(--textColor)] dark:text-gray-300 max-w-xl mb-8">
        We couldn't find any products matching your filters.
        Our shelves are usually stocked - maybe try something different?
      </p>

      <div className="flex flex-col w-[40%] sm:flex-row gap-4">
        <Button
          onClick={() => router.refresh()}
          className="bg-[var(--primaryColor)] dark:bg-[#FFB74D] cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:bg-gray-800 dark:hover:text-[#FFB74D] transition-all duration-200 border border-[var(--primaryColor)] dark:border-[#FFB74D] text-white w-1/2 px-6 py-3 rounded-md flex items-center gap-2"
        >
          <FaSearch /> Try Again
        </Button>

        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="border-[var(--primaryColor)] dark:border-[#FFB74D] w-1/2 cursor-pointer transition-all duration-200 hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] text-[var(--primaryColor)] dark:text-[#FFB74D] px-6 py-3 rounded-md"
        >
          Clear Filters
        </Button>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <h3 className="text-xl font-semibold text-[var(--textColor)] dark:text-gray-200 mb-4">Looking for something specific?</h3>
        <p className="text-[var(--textColor)] dark:text-gray-300 mb-6">
          Our inventory changes frequently. Try these popular categories:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Fresh Fruits', 'Dairy Products', 'Organic Veggies', 'Cold Drinks'].map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => {
                window.location.href = `/products?category=${category.replace(' ', '+')}`
              }}
              className="border-[var(--textColor)] dark:border-gray-600 cursor-pointer hover:bg-transparent hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-all duration-200 text-[var(--textColor)] dark:text-gray-300 py-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>

    // category=Cold+Drinks
  );
};

export default NoProductsFoundUi;