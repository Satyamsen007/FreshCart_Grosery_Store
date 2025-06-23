import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { fetchBestSellingProducts, setFilters } from '@/store/features/getBestSellingProductsSlice';

export const useBestSellingProductsRedux = (page = 1, limit = 15) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Select data from Redux
  const {
    items: products,
    totalPages,
    currentPage,
    status,
    error,
    filters
  } = useSelector((state) => state.getBestSellingProducts);

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
    filters.sort,
    filters.rating,
    filters.offer,
    filters.brand,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
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
      sort: getParam('sort'),
      rating: getNumParam('rating'),
      offer: getParam('offer'),
      brand: getParam('brand'),
      category: getParam('category', 'all'),
      minPrice: getNumParam('minPrice'),
      maxPrice: getNumParam('maxPrice'),
      search: getParam('search')
    };

    dispatch(setFilters(initialFilters));
    setIsInitialized(true);
  }, [searchParams, dispatch, isInitialized]);

  // Fetch products when queryParams change (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const controller = new AbortController();
    dispatch(fetchBestSellingProducts({ ...queryParams, signal: controller.signal }));

    return () => {
      controller.abort();
    };
  }, [dispatch, queryParams, isInitialized]);

  // Sync filters with URL (only after initialization)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (page > 1) params.set('page', page);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.rating) params.set('rating', filters.rating.toString());
    if (filters.offer) params.set('offer', filters.offer);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.search) params.set('search', filters.search);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [page, filters, isInitialized]);

  return {
    products,
    totalPages,
    currentPage,
    loading: status === 'loading',
    error,
    filters,
  };
};