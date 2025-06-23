'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useState } from "react"
import Image from "next/image"
import { RiDeleteBin5Line } from "react-icons/ri"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { useAdminOrders } from "@/hooks/useAdminOrders"
import { assets } from "../../../../public/assets/assets"
import { FiPackage } from "react-icons/fi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch } from "react-redux"
import { deleteOrder, updateOrderStatus, updatePaymentStatus, fetchAdminOrders } from "@/store/features/adminOrdersSlice"
import { toast } from "sonner"

const PRODUCTS_PER_PAGE = 5

const DashboardOrdersTab = () => {
  const { status } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const [isUpdating, setIsUpdating] = useState(false)
  const dispatch = useDispatch()
  const { orders = [], totalPages = 1, loading, error, deletingOrderId } = useAdminOrders(currentPage, PRODUCTS_PER_PAGE)

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      const resultAction = await dispatch(deleteOrder(orderId)).unwrap();
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Delete order error:', error);
      toast.error(error?.message || 'Failed to delete order');
    }
  }

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      setIsUpdating(true);
      const resultAction = await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      if (resultAction?.order) {
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Order status update error:', error);
      toast.error(error?.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    try {
      setIsUpdating(true);
      const resultAction = await dispatch(updatePaymentStatus({ orderId, paymentStatus })).unwrap();
      if (resultAction?.order) {
        toast.success('Payment status updated successfully');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Payment status update error:', error);
      toast.error(error?.message || 'Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  const isLoading = loading || status === 'loading'

  return (
    <div className="w-full h-[90vh] relative overflow-hidden">
      {/* Full Page Loader for Updates */}
      {isUpdating && (
        <div className="absolute inset-0 bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[var(--primaryColor)] dark:border-[#FFB74D] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--textColor)] dark:text-white font-semibold text-sm">Updating...</p>
          </div>
        </div>
      )}

      {/* Decorative image */}
      <div className="xl:w-[250px] xl:h-[250px] max-md:w-[160px] max-md:h-[160px] md:w-[210px] md:h-[210px] absolute right-0 -bottom-[62px] max-md:-bottom-[40px] -z-30">
        <Image
          src={assets.DashboardRightBottomCornerImage}
          alt="Decorative dashboard illustration"
          fill
          className="object-contain dark:opacity-80"
          sizes="(max-width: 768px) 180px, (max-width: 1024px) 230px, 250px"
          priority
        />
      </div>

      <div className="w-full h-fit p-7 max-sm:p-4">
        {/* Header */}
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-3 text-base max-sm:text-sm text-[var(--textColor)] dark:text-white font-semibold">
            <FiPackage className="dark:text-[#FFB74D]" />
            <h4>Track & Manage Orders</h4>
          </div>
        </div>

        <div className="xl:h-[460px] max-md:h-[380px] md:h-[420px] overflow-y-scroll max-sm:border max-sm:border-[var(--primaryColor)] dark:border-[#FFB74D] max-md:mt-5 max-sm:rounded-md srollbar-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table className="sm:border max-sm:border-b border-[var(--primaryColor)] dark:border-[#FFB74D] sm:my-5 max-sm:mb-3">
              <TableHeader>
                <TableRow className="border-b border-[var(--primaryColor)] dark:border-[#FFB74D]">
                  {
                    isLoading && !isUpdating ? (
                      <>
                        <TableHead>
                          <Skeleton className="h-6 w-[240px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          <Skeleton className="h-6 w-[220px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-6 w-[120px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-6 w-[100px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-6 w-[100px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          <Skeleton className="h-6 w-[100px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-6 w-[80px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="text-[var(--textColor)] dark:text-white w-[240px] font-semibold">Order</TableHead>
                        <TableHead className="text-[var(--textColor)] dark:text-white md:hidden lg:table-cell w-[220px] font-semibold text-center">Customer</TableHead>
                        <TableHead className="w-[120px] text-[var(--textColor)] dark:text-white md:hidden lg:table-cell font-semibold text-center">Date</TableHead>
                        <TableHead className="w-[100px] text-[var(--textColor)] dark:text-white font-semibold text-center">Status</TableHead>
                        <TableHead className="w-[100px] text-[var(--textColor)] dark:text-white font-semibold text-center">Amount</TableHead>
                        <TableHead className="w-[100px] hidden md:table-cell text-[var(--textColor)] dark:text-white font-semibold text-center">Payment Status</TableHead>
                        <TableHead className="w-[80px] text-[var(--textColor)] dark:text-white font-semibold text-center">Actions</TableHead>
                      </>
                    )
                  }
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && !isUpdating ? (
                  // Skeleton Loading State
                  [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`} className="border-b border-[var(--primaryColor)] dark:border-[#FFB74D]">
                      <TableCell className="font-medium">
                        <div className="flex items-center flex-col gap-3">
                          <div className="bg-[var(--primaryColor)]/40 dark:bg-gray-700 w-24 h-12 flex items-center justify-center rounded-sm">
                            <Skeleton className="w-12 h-12 rounded-md bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                          </div>
                          <Skeleton className="h-4 w-[200px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-10 h-10 rounded-full bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                            <Skeleton className="h-4 w-[100px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                          </div>
                          <Skeleton className="h-4 w-[180px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Skeleton className="h-4 w-[120px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                          <Skeleton className="h-3 w-[80px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-8 w-[120px] mx-auto rounded-md bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-[60px] mx-auto bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <Skeleton className="h-8 w-[120px] mx-auto rounded-md bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-14 mx-auto rounded-sm bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : orders.length > 0 ? (
                  // Actual Products
                  orders.map((order) => {
                    return <TableRow key={order._id} className="border-b border-[var(--primaryColor)] dark:border-[#FFB74D] hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center flex-col gap-3">
                          <div className="bg-[var(--primaryColor)]/40 dark:bg-[#FFB74D]/40 w-24 h-12 flex items-center justify-center rounded-sm flex-shrink-0">
                            <div className="relative w-12 h-12">
                              <Image
                                src={assets.adminOrdersProductImage}
                                alt={order.items[0].product.name}
                                fill
                                className="object-contain"
                                sizes="48px"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[var(--textColor)] dark:text-white text-sm text-wrap">
                              {order.items.map((item, index) => (
                                <span key={item._id}>
                                  {item.product.name} {item?.product?.variants?.find((variant) =>
                                    variant._id === item.variantId
                                  )?.weight} x <span className="text-[var(--primaryColor)] dark:text-[#FFB74D]">{item.quantity}</span>
                                  {index < order.items.length - 1 && ', '}
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center md:hidden lg:table-cell text-[var(--textColor)]/90 dark:text-gray-200">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-full overflow-hidden">
                              <Image src={order?.buyer?.avatar?.url || assets.userDefaultAvatar} width={40} height={40} alt="Order Buyer Avatar" className="object-contain" sizes="40px" />
                            </div>
                            <p className="text-sm dark:text-white">{order?.buyer?.fullName}</p>
                          </div>
                          <div className="text-wrap text-sm">
                            <p className="dark:text-gray-300">
                              {order?.shippingInfo?.address}, {order?.shippingInfo?.city}, {order?.shippingInfo?.state} - {order?.shippingInfo?.postalCode}, {order?.shippingInfo?.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center md:hidden lg:table-cell text-[var(--textColor)]/90 dark:text-gray-200">
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-sm font-medium dark:text-white">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-[var(--textColor)]/70 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-[var(--textColor)] dark:text-white">
                        <Select
                          value={order.status}
                          disabled={order.status === 'cancelled'}
                          onValueChange={(value) => handleOrderStatusChange(order._id, value)}
                        >
                          <SelectTrigger className={`w-[120px] border-none mx-auto shadow-none flex items-center justify-center gap-1 ${order.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} dark:bg-gray-800 hover:bg-transparent`}>
                            <SelectValue>
                              <span className={`capitalize ${order.status === 'cancelled' ? 'cursor-not-allowed' : 'cursor-pointer'} ${order.status === 'ordered' ? 'text-yellow-500' :
                                order.status === 'order confirm' ? 'text-blue-500' :
                                  order.status === 'shipped' ? 'text-purple-500' :
                                    order.status === 'out for delivery' ? 'text-orange-500' :
                                      order.status === 'delivered' ? 'text-green-500' :
                                        'text-red-500'
                                }`}>{order.status}</span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            <SelectItem value="ordered" className="text-yellow-500 cursor-pointer">Ordered</SelectItem>
                            <SelectItem value="order confirm" className="text-blue-500 cursor-pointer">Order Confirm</SelectItem>
                            <SelectItem value="shipped" className="text-purple-500 cursor-pointer">Shipped</SelectItem>
                            <SelectItem value="out for delivery" className="text-orange-500 cursor-pointer">Out for Delivery</SelectItem>
                            <SelectItem value="delivered" className="text-green-500 cursor-pointer">Delivered</SelectItem>
                            <SelectItem value="cancelled" className="text-red-500 disabled:cursor-not-allowed" disabled>Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center text-[var(--textColor)]/90 dark:text-white">
                        <p>
                          ₹{order.totalAmount}
                        </p>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell text-[var(--textColor)]/90 dark:text-white">
                        <Select
                          value={order.paymentStatus}
                          onValueChange={(value) => handlePaymentStatusChange(order._id, value)}
                        >
                          <SelectTrigger className="w-[120px] border-none mx-auto shadow-none flex items-center justify-center gap-1 cursor-pointer dark:bg-gray-800 hover:bg-transparent">
                            <SelectValue>
                              <span className={`capitalize cursor-pointer ${order.paymentStatus === 'pending' ? 'text-yellow-500' :
                                order.paymentStatus === 'unpaid' ? 'text-red-500' :
                                  order.paymentStatus === 'paid' ? 'text-green-500' :
                                    order.paymentStatus === 'failed' ? 'text-red-500' :
                                      'text-blue-500'
                                }`}>{order.paymentStatus}</span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            <SelectItem value="pending" className="text-yellow-500 cursor-pointer">Pending</SelectItem>
                            <SelectItem value="unpaid" className="text-red-500 cursor-pointer">Unpaid</SelectItem>
                            <SelectItem value="paid" className="text-green-500 cursor-pointer">Paid</SelectItem>
                            <SelectItem value="failed" className="text-red-500 cursor-pointer">Failed</SelectItem>
                            <SelectItem value="refunded" className="text-blue-500 cursor-pointer">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`w-14 h-8 mx-auto cursor-pointer flex items-center justify-center rounded-sm text-[var(--primaryColor)] dark:text-[#FFB74D] text-xl border border-[var(--primaryColor)] dark:border-[#FFB74D] ${deletingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !deletingOrderId && handleDeleteOrder(order._id)}
                        >
                          {deletingOrderId === order._id ? (
                            <div className="w-4 h-4 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <RiDeleteBin5Line />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  })
                ) : !isLoading && (
                  // Empty State
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/10 flex items-center justify-center animate-bounce">
                          <svg className="w-8 h-8 text-[var(--primaryColor)] dark:text-[#FFB74D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-[var(--textColor)] dark:text-white font-medium">No Orders Available</p>
                          <p className="text-sm text-[var(--textColor)]/60 dark:text-gray-400">Customer orders will be displayed here</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {isLoading && !isUpdating ? (
              // Mobile Skeleton Loading
              [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                <div key={`mobile-skeleton-${i}`} className="mb-4 p-4 border border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-lg">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-16 h-16 rounded-md bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-[200px] bg-[var(--primaryColor)]/20 dark:bg-gray-700 mb-2" />
                        <Skeleton className="h-3 w-[150px] bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-[120px] rounded-md bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                      <Skeleton className="h-8 w-[100px] rounded-md bg-[var(--primaryColor)]/20 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))
            ) : orders.length > 0 ? (
              // Mobile Order Cards
              orders.map((order) => (
                <div key={order._id} className="mb-4 p-4 border border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-lg dark:bg-gray-800">
                  {/* Order Items */}
                  <div className="flex flex-col items-center gap-3 mb-3">
                    <div className="bg-[var(--primaryColor)]/40 dark:bg-[#FFB74D]/40 w-16 h-16 flex items-center justify-center rounded-sm flex-shrink-0">
                      <div className="relative w-12 h-12">
                        <Image
                          src={assets.adminOrdersProductImage}
                          alt={order.items[0].product.name}
                          fill
                          className="object-contain"
                          sizes="48px"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--textColor)] dark:text-white text-sm text-center">
                        {order.items.map((item, index) => (
                          <span key={item._id}>
                            {item.product.name} {item?.product?.variants?.find((variant) =>
                              variant._id === item.variantId
                            )?.weight} x <span className="text-[var(--primaryColor)] dark:text-[#FFB74D]">{item.quantity}</span>
                            {index < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 h-8 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-full overflow-hidden">
                        <Image
                          src={order?.buyer?.avatar?.url || assets.userDefaultAvatar}
                          width={32}
                          height={32}
                          alt="Order Buyer Avatar"
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                      <p className="text-sm font-medium dark:text-white">{order?.buyer?.fullName}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[var(--textColor)]/70 dark:text-gray-400 text-center">
                        {order?.shippingInfo?.address}, {order?.shippingInfo?.city}, {order?.shippingInfo?.state} - {order?.shippingInfo?.postalCode}, {order?.shippingInfo?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex justify-between items-center w-[90%] mx-auto mb-3">
                    <div>
                      <p className="text-xs text-[var(--textColor)]/70 dark:text-gray-400">Date</p>
                      <p className="text-sm text-[var(--textColor)] dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-[var(--textColor)]/70 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--textColor)]/70 dark:text-gray-400">Amount</p>
                      <p className="text-sm dark:text-white">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Status Controls */}
                  <div className="flex items-center mb-3 gap-2">
                    <Select
                      value={order.status}
                      disabled={order.status === 'cancelled'}
                      onValueChange={(value) => handleOrderStatusChange(order._id, value)}
                    >
                      <SelectTrigger className={`w-full border-none shadow-none flex items-center justify-center gap-1 ${order.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} dark:bg-gray-800 hover:bg-transparent`}>
                        <SelectValue>
                          <span className={`capitalize ${order.status === 'cancelled' ? 'cursor-not-allowed' : 'cursor-pointer'} ${order.status === 'ordered' ? 'text-yellow-500' :
                            order.status === 'order confirm' ? 'text-blue-500' :
                              order.status === 'shipped' ? 'text-purple-500' :
                                order.status === 'out for delivery' ? 'text-orange-500' :
                                  order.status === 'delivered' ? 'text-green-500' :
                                    'text-red-500'
                            }`}>{order.status}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem value="ordered" className="text-yellow-500 cursor-pointer">Ordered</SelectItem>
                        <SelectItem value="order confirm" className="text-blue-500 cursor-pointer">Order Confirm</SelectItem>
                        <SelectItem value="shipped" className="text-purple-500 cursor-pointer">Shipped</SelectItem>
                        <SelectItem value="out for delivery" className="text-orange-500 cursor-pointer">Out for Delivery</SelectItem>
                        <SelectItem value="delivered" className="text-green-500 cursor-pointer">Delivered</SelectItem>
                        <SelectItem value="cancelled" className="text-red-500 disabled:cursor-not-allowed" disabled>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={order.paymentStatus}
                      onValueChange={(value) => handlePaymentStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-full border-none shadow-none flex items-center justify-center gap-1 cursor-pointer dark:bg-gray-800 hover:bg-transparent">
                        <SelectValue>
                          <span className={`capitalize cursor-pointer ${order.paymentStatus === 'pending' ? 'text-yellow-500' :
                            order.paymentStatus === 'unpaid' ? 'text-red-500' :
                              order.paymentStatus === 'paid' ? 'text-green-500' :
                                order.paymentStatus === 'failed' ? 'text-red-500' :
                                  'text-blue-500'
                            }`}>{order.paymentStatus}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem value="pending" className="text-yellow-500 cursor-pointer">Pending</SelectItem>
                        <SelectItem value="unpaid" className="text-red-500 cursor-pointer">Unpaid</SelectItem>
                        <SelectItem value="paid" className="text-green-500 cursor-pointer">Paid</SelectItem>
                        <SelectItem value="failed" className="text-red-500 cursor-pointer">Failed</SelectItem>
                        <SelectItem value="refunded" className="text-blue-500 cursor-pointer">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div
                    className={`w-full h-10 cursor-pointer flex items-center justify-center rounded-sm text-[var(--primaryColor)] dark:text-[#FFB74D] text-xl border border-[var(--primaryColor)] dark:border-[#FFB74D] ${deletingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !deletingOrderId && handleDeleteOrder(order._id)}
                  >
                    {deletingOrderId === order._id ? (
                      <div className="w-4 h-4 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RiDeleteBin5Line />
                    )}
                  </div>
                </div>
              ))
            ) : !isLoading && (
              // Empty State
              <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[var(--textColor)]/80 dark:text-gray-300">No orders found</p>
                  <p className="text-sm text-[var(--textColor)]/60 dark:text-gray-400">No orders have been placed yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination - only show if not loading and products exist */}
          {!isLoading && orders.length > 0 && totalPages > 1 && (
            <div className="flex justify-between w-full items-center max-sm:flex-col max-sm:gap-2 mt-4">
              <div className="text-sm text-[var(--textColor)]/80 dark:text-gray-300">
                Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} to {(currentPage - 1) * PRODUCTS_PER_PAGE + orders.length} of {totalPages * PRODUCTS_PER_PAGE} results
              </div>
              <Pagination className='w-[40%] max-sm:justify-center justify-end mx-0 max-sm:mb-5'>
                <PaginationContent className="flex max-md:gap-3 justify-center">
                  <PaginationItem className="cursor-pointer">
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault()
                        changePage(currentPage - 1)
                      }}
                      className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} dark:text-white dark:hover:text-[#FFB74D]`}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i} className="cursor-pointer">
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault()
                          changePage(i + 1)
                        }}
                        isActive={currentPage === i + 1}
                        className="dark:text-white dark:hover:text-[#FFB74D]"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem className="cursor-pointer">
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault()
                        changePage(currentPage + 1)
                      }}
                      className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} dark:text-white dark:hover:text-[#FFB74D]`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardOrdersTab;