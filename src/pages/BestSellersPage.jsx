'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import { FaFilter, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { allCategorysWithAllProducts, babyCareBrands, cleaningGoodBrands, coldDrinksBrands, cookingOilBrands, dairyProductBrands, discountFilterOptions, freshBakeryBrands, freshFruitsBrands, frozenFoodBrands, grainsCerealsBrands, healthDrinkBrands, instantMealsBrands, masalaZoneBrands, organicVagiesBrands, priceFilterOptions, ratingFilterOptions, sweetTreatBrands } from '../../public/assets/assets';
import ProductCard from '@/components/custom-components/products/ProductCard';
import { useDispatch } from 'react-redux';
import ProductCardSkeleton from '@/components/custom-components/products/ProductCardSkeleton';
import { FaFilterCircleXmark } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import NoProductsFoundUi from '@/components/custom-components/products/NoProductFoundUi';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useBestSellingProductsRedux } from '@/hooks/useBestSellingProducts';
import { fetchBestSellingProducts, resetFilters, setFilters, setPage } from '@/store/features/getBestSellingProductsSlice';

const BestSellerPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('');
  const { status } = useSession();

  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    filters
  } = useBestSellingProductsRedux();

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page)
    }
  }

  useEffect(() => {
    if (filters.category) {
      setSelectedCategory(filters.category === 'all' ? 'All Products' : filters.category);
    } else {
      setSelectedCategory('All Products');
    }
    if (filters.brand) {
      setSelectedBrand(filters.brand);
    }
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      const priceValue = `${filters.minPrice}-${filters.maxPrice}`;
      setSelectedPrice(priceValue);
    }
    if (filters.rating !== undefined) {
      setSelectedRating(filters.rating.toString());
    }
    if (filters.offer) {
      setSelectedOffer(filters.offer);
    }
  }, [filters]);


  const brandOptionsMap = {
    'All Products': [...organicVagiesBrands, ...freshFruitsBrands, ...coldDrinksBrands, ...instantMealsBrands, ...dairyProductBrands, ...freshBakeryBrands, ...grainsCerealsBrands, ...frozenFoodBrands, ...sweetTreatBrands, ...cookingOilBrands, ...babyCareBrands, ...masalaZoneBrands, ...healthDrinkBrands, ...cleaningGoodBrands],
    'Organic Veggies': organicVagiesBrands,
    'Fresh Fruits': freshFruitsBrands,
    'Cold Drinks': coldDrinksBrands,
    'Instant Meals': instantMealsBrands,
    'Dairy Products': dairyProductBrands,
    'Fresh Bakery': freshBakeryBrands,
    'Grains & Cereals': grainsCerealsBrands,
    'Frozen Foods': frozenFoodBrands,
    'Sweet Treats': sweetTreatBrands,
    'Cooking Oils': cookingOilBrands,
    'Baby Care': babyCareBrands,
    'Masala Zone': masalaZoneBrands,
    'Health Drinks': healthDrinkBrands,
    'Cleaning Goods': cleaningGoodBrands,
  };
  const selectedBrands = brandOptionsMap[selectedCategory];

  const dispatch = useDispatch();

  const handleResetFilters = () => {
    // Reset local UI state (important)
    setSelectedCategory('All Products');
    setSelectedBrand('');
    setSelectedPrice('');
    setSelectedRating('');
    setSelectedOffer('');

    // Reset Redux state
    dispatch(resetFilters());

    // Trigger fresh fetch after filter reset
    dispatch(fetchBestSellingProducts({
      page: 1,
      limit: 15,
      rating: undefined,
      offer: '',
      brand: '',
      category: 'all',
      minPrice: undefined,
      maxPrice: undefined,
    }));
  };


  const hasActiveFilters = () => {
    return (
      selectedCategory !== 'All Products' ||
      selectedBrand !== '' ||
      selectedPrice !== '' ||
      selectedRating !== '' ||
      selectedOffer !== ''
    );
  };

  const isLoading = loading || status === 'loading'
  return (
    <div className="px-4 py-8 w-[90%] mx-auto dark:bg-gray-900">

      {
        status === 'loading' ? (
          <div className="mb-5 w-[20%]">
            {/* Title Skeleton */}
            <Skeleton className="h-7 bg-[var(--primaryColor)]/50 w-48 mb-1 dark:bg-gray-700" />
            <Skeleton className="w-full bg-[var(--primaryColor)]/50 h-1 rounded-md dark:bg-gray-700" />
          </div>
        ) : (
          <div className='mb-5 w-[30%]'>
            <h1 className="text-2xl font-semibold text-[var(--textColor)] mb-1 dark:text-gray-100">Our Best Selling Products</h1>
            <span className="block w-full h-1 bg-gradient-to-r from-[var(--primaryColor)] dark:from-[#FFB74D] rounded-md to-transparent"></span>
          </div>
        )
      }

      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-5'>
          {
            status === 'loading' ? (
              <div className="flex items-center gap-2 mb-3 text-lg font-semibold text-[var(--textColor)]">
                <Skeleton className="h-5 w-5 rounded-full bg-[var(--primaryColor)]/50" />
                <Skeleton className="h-5 w-40 rounded-md bg-[var(--primaryColor)]/50" />
              </div>
            ) : (
              <div className={`flex items-center gap-2 ${hasActiveFilters() ? 'hidden' : 'mb-3'} text-lg font-semibold text-[var(--textColor)] dark:text-gray-300`}>
                <FaFilter />
                <h2 className="text-lg font-semibold text-[var(--textColor)] dark:text-gray-300">Filter Products</h2>
              </div>
            )
          }

          <div className={`flex flex-wrap gap-3 ${!hasActiveFilters() ? 'hidden' : 'mb-4'}`}>
            {selectedCategory !== 'All Products' && (
              <div className="flex relative items-center text-[var(--textColor)] border border-[var(--primaryColor)] px-4 w-fit py-1 rounded-md dark:text-gray-200 dark:border-gray-700">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    dispatch(setFilters({ ...filters, category: 'all' }));
                  }}
                  className="text-white p-[2px] flex items-center justify-center cursor-pointer rounded-full bg-[var(--primaryColor)] absolute -top-[6px] -right-[6px]"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            )}
            
            {selectedPrice && (
              <div className="flex relative items-center text-[var(--textColor)] border border-[var(--primaryColor)] px-4 w-fit py-1 rounded-md dark:text-gray-200 dark:border-gray-700">
                <span>{priceFilterOptions.find(opt => opt.value === selectedPrice)?.label || selectedPrice}</span>
                <button
                  onClick={() => {
                    setSelectedPrice('');
                    dispatch(setFilters({ ...filters, minPrice: undefined, maxPrice: undefined }));
                  }}
                  className="text-white p-[2px] flex items-center justify-center cursor-pointer rounded-full bg-[var(--primaryColor)] absolute -top-[6px] -right-[6px]"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            )}

            {selectedRating && (
              <div className="flex relative items-center text-[var(--textColor)] border border-[var(--primaryColor)] px-4 w-fit py-1 rounded-md dark:text-gray-200 dark:border-gray-700">
                <span>{ratingFilterOptions.find(opt => opt.value === Number(selectedRating))?.label || selectedRating}</span>
                <button
                  onClick={() => {
                    setSelectedRating('');
                    dispatch(setFilters({ ...filters, rating: undefined }));
                  }}
                  className="text-white p-[2px] flex items-center justify-center cursor-pointer rounded-full bg-[var(--primaryColor)] absolute -top-[6px] -right-[6px]"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            )}

            {selectedOffer && (
              <div className="flex relative items-center text-[var(--textColor)] border border-[var(--primaryColor)] px-4 w-fit py-1 rounded-md dark:text-gray-200 dark:border-gray-700">
                <span>{discountFilterOptions.find(opt => opt.value === selectedOffer)?.label || selectedOffer}</span>
                <button
                  onClick={() => {
                    setSelectedOffer('');
                    dispatch(setFilters({ ...filters, offer: '' }));
                  }}
                  className="text-white p-[2px] flex items-center justify-center cursor-pointer rounded-full bg-[var(--primaryColor)] absolute -top-[6px] -right-[6px]"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            )}

            {selectedBrand && (
              <div className="flex relative items-center text-[var(--textColor)] border border-[var(--primaryColor)] px-4 w-fit py-1 rounded-md dark:text-gray-200 dark:border-gray-700">
                <span>{selectedBrand}</span>
                <button
                  onClick={() => {
                    setSelectedBrand('');
                    dispatch(setFilters({ ...filters, brand: '' }));
                  }}
                  className="text-white p-[2px] flex items-center justify-center cursor-pointer rounded-full bg-[var(--primaryColor)] absolute -top-[6px] -right-[6px]"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 mb-3 border px-4 py-[6px] rounded-md text-base font-medium cursor-pointer border-[var(--primaryColor)] text-[var(--primaryColor)] dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-800"
          >
            <FaFilterCircleXmark />
            Clear All Filters
          </button>
        )}

      </div>

      {
        status === 'loading' ? (
          <div className="flex flex-wrap gap-6 mb-6">
            {/* Category Select Skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton className="w-40 h-10 bg-[var(--primaryColor)]/50 rounded-md dark:bg-gray-700" />
            </div>

            {/* Price Select Skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton className="w-24 h-10 bg-[var(--primaryColor)]/50 rounded-md" />
            </div>

            {/* Rating Select Skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton className="w-24 h-10 bg-[var(--primaryColor)]/50 rounded-md" />
            </div>

            {/* Offer Select Skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton className="w-24 h-10 bg-[var(--primaryColor)]/50 rounded-md" />
            </div>

            {/* Brand Select Skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-10 bg-[var(--primaryColor)]/50 rounded-md dark:bg-gray-700" />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 mb-6">
            <Select
              disabled={isLoading}
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setSelectedBrand('');
                dispatch(setFilters({
                  ...filters,
                  category: value === 'All Products' ? 'all' : value,
                  brand: ''
                }));
              }
              }
            >
              <SelectTrigger className="w-40 text-white font-medium border cursor-pointer border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400">
                <SelectValue placeholder="All Products">
                  {selectedCategory || 'All Products'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allCategorysWithAllProducts.map((category, i) => (
                    <SelectItem key={i} value={category} className='text-[var(--textColor)] cursor-pointer dark:text-gray-300 hover:dark:bg-gray-700'>{category}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={selectedPrice}
              onValueChange={(value) => {
                setSelectedPrice(value);
                const [minPrice, maxPrice] = value.split('-').map(Number);
                dispatch(setFilters({ ...filters, minPrice, maxPrice }));
              }}
            >
              <SelectTrigger className="w-fit border cursor-pointer border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {priceFilterOptions.map((option, i) => (
                  <SelectItem 
                    className='cursor-pointer text-[var(--textColor)] dark:text-gray-300 hover:dark:bg-gray-700' 
                    key={i} 
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedRating}
              onValueChange={(value) => {
                setSelectedRating(value);
                dispatch(setFilters({ ...filters, rating: Number(value) }));
              }}
            >
              <SelectTrigger className="w-fit border cursor-pointer border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {ratingFilterOptions.map((option, i) => (
                  <SelectItem className='cursor-pointer text-[var(--textColor)] dark:text-gray-300 hover:dark:bg-gray-700' key={i} value={String(option.value)}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedOffer}
              onValueChange={(value) => {
                setSelectedOffer(value);
                dispatch(setFilters({ ...filters, offer: value }));
              }}
            >
              <SelectTrigger className="w-fit cursor-pointer border border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400">
                <SelectValue placeholder="Offer" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {discountFilterOptions.map((option, i) => (
                  <SelectItem 
                    className='cursor-pointer text-[var(--textColor)] dark:text-gray-300 hover:dark:bg-gray-700' 
                    key={i} 
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBrand}
              onValueChange={(value) => {
                setSelectedBrand(value);
                dispatch(setFilters({ ...filters, brand: value }));
              }}
              disabled={!selectedBrands?.length}
            >
              <SelectTrigger className={`w-fit cursor-pointer border border-[var(--textColor)]/30 dark:border-gray-600 dark:bg-gray-800 [&>span]:dark:text-gray-400`}>
                <SelectValue placeholder="Select a Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedBrands && (
                    <>
                      {selectedBrands.map((brand, i) => (
                        <SelectItem key={i} value={brand} className='cursor-pointer text-[var(--textColor)] dark:text-gray-300 hover:dark:bg-gray-700'>
                          {brand}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 max-lg:mb-14 gap-4">
        {isLoading ? (
          Array.from({ length: 20 }).map((_, i) => (
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
          <div className="col-span-full">
            <NoProductsFoundUi handleResetFilters={handleResetFilters} />
          </div>
        ) : (
          products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))
        )}
      </div>

      {/* Pagination - only show if not loading and products exist */}
      {!isLoading && products.length > 0 && totalPages > 1 && (
        <Pagination className='max-sm:mb-5 mt-10'>
          <PaginationContent className="flex justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault()
                  changePage(currentPage - 1)
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(i + 1)
                  }}
                  isActive={currentPage === i + 1}
                  className="dark:text-gray-300 dark:hover:bg-gray-800 dark:data-[active=true]:bg-gray-700"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault()
                  changePage(currentPage + 1)
                }}
                className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} dark:text-gray-300 dark:hover:bg-gray-800`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default BestSellerPage;