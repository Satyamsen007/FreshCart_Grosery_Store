import { fetchAdminProducts } from '@/store/features/getAdminProductsSlice';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useAdminProducts = (page = 1, limit = 6) => {
  const dispatch = useDispatch();

  // Make sure this selector matches your actual Redux slice name
  const productsState = useSelector((state) => state.getAdminProducts);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchAdminProducts({ page, limit }));

    return () => controller.abort();
  }, [dispatch, page, limit]);

  return {
    products: productsState?.items || [],
    totalPages: productsState?.totalPages || 1,
    currentPage: productsState?.currentPage || page,
    loading: productsState?.status === 'loading',
    error: productsState?.error || null
  };
};