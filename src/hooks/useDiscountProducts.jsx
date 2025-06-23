import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { fetchDiscountProducts, setFilters } from '@/store/features/getDiscountProductsSlice';

export const useDiscountProductsRedux = (page = 1, limit = 15) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Select data from Redux
  const {
    items: products,
    totalPages,
    currentPage,
    status,
    error,
    filters
  } = useSelector((state) => state.getDiscountProducts);

  // Memoize queryParams for fetchAllProducts
  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      ...filters,
    };
  }, [
    page,
    limit,
    filters.rating,
    filters.offer,
    filters.brand,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ]);

  // On first mount, initialize filters from URL before making any requests
  useEffect(() => {
    if (!searchParams || isInitialized) return;

    const getParam = (key, defaultVal = '') => searchParams.get(key) || defaultVal;
    const getNumParam = (key) => {
      const param = searchParams.get(key);
      return param ? Number(param) : undefined;
    };

    const initialFilters = {
      rating: getNumParam('rating'),
      offer: getParam('offer'),
      brand: getParam('brand'),
      category: getParam('category', 'all'),
      minPrice: getNumParam('minPrice'),
      maxPrice: getNumParam('maxPrice'),
    };

    dispatch(setFilters(initialFilters));
    setIsInitialized(true);
  }, [searchParams, dispatch, isInitialized]);

  // Fetch products when queryParams change (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const controller = new AbortController();
    setIsLoading(true);

    dispatch(fetchDiscountProducts({ ...queryParams, signal: controller.signal }))
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
      setIsLoading(false);
    };
  }, [dispatch, queryParams, isInitialized]);

  // Sync filters with URL (only after initialization)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (page > 1) params.set('page', page);
    if (filters.rating) params.set('rating', filters.rating.toString());
    if (filters.offer) params.set('offer', filters.offer);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [page, filters, isInitialized]);

  return {
    products,
    totalPages,
    currentPage,
    loading: isLoading,
    error,
    filters,
  };
};