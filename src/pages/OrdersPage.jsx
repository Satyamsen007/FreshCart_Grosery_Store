'use client'

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { GrHomeRounded } from "react-icons/gr";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fetchOrders, cancelOrder } from '@/store/features/orderSlice';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const OrderStatusIcon = ({ status }) => {
  switch (status) {
    case 'ordered':
      return <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    case 'order confirm':
      return <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />;
    case 'shipped':
      return <Package className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
    case 'out for delivery':
      return <Truck className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
    case 'delivered':
      return <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
  }
};

const OrdersPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: orders, loading, error, cancellingOrderId } = useSelector((state) => state.orders);
  const { status } = useSession();
  const isLoading = loading || status === 'loading';
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCancelOrder = async (orderId) => {
    try {
      if (!orderId) {
        toast.error('Invalid order ID');
        return;
      }

      const resultAction = await dispatch(cancelOrder(orderId)).unwrap();
      if (resultAction) {
        toast.success('Order cancelled successfully');
        setTimeout(() => {
          dispatch(fetchOrders());
        }, 500);
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error(error?.message || 'Failed to cancel order. Please try again.');
    }
  };

  const canBeCancelled = (order) => {
    return order.status === 'ordered' || order.status === 'order confirm';
  };

  if (isLoading) {
    return (
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 py-8">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-full" />
          <Skeleton className="w-32 h-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700 rounded-md" />
        </div>
        <Skeleton className="w-48 h-8 bg-[var(--primaryColor)]/50 dark:bg-gray-700 mt-5 rounded-md" />
        <div className="space-y-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--primaryColor)]/50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="w-48 h-4 dark:bg-gray-700 rounded-md" />
                  <Skeleton className="w-36 h-4 dark:bg-gray-700 rounded-md" />
                </div>
                <Skeleton className="w-24 h-8 dark:bg-gray-700 rounded-md" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-20 h-20 dark:bg-gray-700 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="w-3/4 h-4 mb-2 dark:bg-gray-700 rounded-md" />
                  <Skeleton className="w-1/2 h-4 dark:bg-gray-700 rounded-md" />
                </div>
                <Skeleton className="w-24 h-8 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="w-32 h-4 dark:bg-gray-700 rounded-md" />
                <Skeleton className="w-24 h-8 dark:bg-gray-700 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--textColor)] dark:text-gray-100 mb-2">Error Loading Orders</h2>
          <p className="text-[var(--textColor)]/70 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 py-8">
      <div className='flex items-center gap-2 text-sm text-[var(--textColor)] font-medium dark:text-gray-300'>
        <GrHomeRounded className="dark:text-gray-300" />
        <p>/ online-store / orders</p>
      </div>

      <h1 className="text-2xl font-semibold text-[var(--textColor)] dark:text-gray-100 mt-5 mb-8">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-[var(--primaryColor)]/50 dark:text-[#FFB74D]/50 mx-auto mb-4 animate-bounce hover:animate-pulse transition-all duration-300" />
          <h2 className="text-xl font-semibold text-[var(--textColor)] dark:text-gray-100 mb-2">No Orders Yet</h2>
          <p className="text-[var(--textColor)]/70 dark:text-gray-300 mb-6">Looks like you haven't made any orders yet.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-[var(--primaryColor)] dark:bg-[#FFB74D] cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-[var(--primaryColor)]/90 dark:hover:bg-[#FFB74D]/90"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg border border-[var(--primaryColor)]/60 dark:border-[#FFB74D]/30 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400 mb-1">
                    Order ID: <span className="font-medium text-[var(--textColor)] dark:text-gray-100 break-all">{order._id}</span>
                  </p>
                  <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">
                    Placed on: <span className="font-medium text-[var(--textColor)] dark:text-gray-100">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </p>
                </div>
                <div className="flex max-md:justify-between items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <OrderStatusIcon status={order.status} />
                    <span className="text-sm font-medium capitalize text-[var(--textColor)] dark:text-gray-100">
                      {order.status}
                    </span>
                  </div>
                  {canBeCancelled(order) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="text-sm font-medium cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                          disabled={cancellingOrderId === order._id}
                        >
                          {cancellingOrderId === order._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Cancel Order'
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90%] sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="dark:text-gray-100">Cancel Order</AlertDialogTitle>
                          <AlertDialogDescription className="dark:text-gray-300">
                            Are you sure you want to cancel this order? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className='cursor-pointer w-full sm:w-auto dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'>No, keep order</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 cursor-pointer hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 w-full sm:w-auto"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Yes, cancel order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-[var(--primaryColor)]/60 dark:border-gray-700 py-4 space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="h-16 w-16 md:h-20 md:w-20 relative flex-shrink-0">
                      <Image
                        src={item.product && item.product.images && item.product.images.length > 0
                          ? item.product.images[0].url
                          : '/placeholder-product.png'}
                        alt={item.product ? item.product.name : 'Product Image'}
                        fill
                        className="object-contain dark:brightness-90"
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className='font-medium text-[var(--textColor)] dark:text-gray-100 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                        <h3 className="truncate">
                          {item.product ? item.product.name : 'Product Name Unavailable'}
                        </h3>
                        <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">
                          {item?.product?.variants?.find((variant) =>
                            variant?._id === item?.variantId
                          )?.weight || 'N/A'}
                        </p>
                      </div>
                      <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">Payment Status:</span>
                  <span className={`text-sm font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-green-500 dark:text-green-400' :
                    order.paymentStatus === 'unpaid' ? 'text-red-500 dark:text-red-400' :
                      'text-orange-500 dark:text-orange-400'
                    }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">Total Amount:</p>
                  <p className="text-lg font-semibold text-[var(--primaryColor)] dark:text-[#FFB74D]">
                    ₹{order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export with dynamic import for client-side only rendering
export default dynamic(() => Promise.resolve(OrdersPage), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primaryColor)]"></div>
    </div>
  )
});