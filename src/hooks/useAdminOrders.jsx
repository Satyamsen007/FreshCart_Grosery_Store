import { fetchAdminOrders } from '@/store/features/adminOrdersSlice';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useAdminOrders = (page = 1, limit = 6) => {
  const dispatch = useDispatch();

  // Make sure this selector matches your actual Redux slice name
  const ordersState = useSelector((state) => state.getAdminOrders);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchAdminOrders({ page, limit }));

    return () => controller.abort();
  }, [dispatch, page, limit]);

  return {
    orders: ordersState?.orders || [],
    totalPages: ordersState?.totalPages || 1,
    currentPage: ordersState?.currentPage || page,
    loading: ordersState?.status === 'loading',
    error: ordersState?.error || null,
    deletingOrderId: ordersState?.deletingOrderId || null
  };
};