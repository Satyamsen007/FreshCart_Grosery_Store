import { fetchAdminCustomers } from '@/store/features/getAdminCustomersSlice';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useAdminCustomers = (page = 1, limit = 5) => {
  const dispatch = useDispatch();
  const customersState = useSelector((state) => state.getAdminCustomers);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchAdminCustomers({ page, limit }));

    return () => controller.abort();
  }, [dispatch, page, limit]);

  return {
    customers: customersState?.items || [],
    totalPages: customersState?.totalPages || 1,
    currentPage: customersState?.currentPage || page,
    loading: customersState?.status === 'loading',
    error: customersState?.error || null
  };
}; 