import React, { useMemo, useCallback } from 'react';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Rating } from '@mui/material';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCartItem } from '@/store/features/cartSlice';
import Link from 'next/link';
import { toast } from 'sonner';

const DiscountProductCard = ({ product, showLink = true }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { loading } = useSelector(state => state.cart);

  const variant = useMemo(() => product?.variants?.[0], [product]);
  const hasDiscount = useMemo(() =>
    variant?.isDiscountActive && variant?.discountPrice < variant?.regularPrice,
    [variant]
  );
  const finalPrice = useMemo(() =>
    hasDiscount ? variant.regularPrice - variant.discountPrice : variant.regularPrice,
    [hasDiscount, variant]
  );

  const cartItem = useMemo(() =>
    cartItems.find(item =>
      item.productId === product._id &&
      item.variantId === variant._id
    ),
    [cartItems, product._id, variant._id]
  );

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product,
      variantId: variant._id,
      quantity: 1
    }));
    toast.success('Item added to cart successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  }, [dispatch, product, variant._id]);

  const handleUpdateQuantity = useCallback((e, newQuantity) => {
    e.preventDefault();
    e.stopPropagation();
    if (newQuantity < 1) return;

    dispatch(updateCartItem({
      productId: product._id,
      variantId: variant._id,
      quantity: newQuantity
    }));
    toast.success('Cart updated successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  }, [dispatch, product._id, variant._id]);

  const QuantityControls = useCallback(({ className = "" }) => (
    <div
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`flex items-center justify-center gap-1 bg-[var(--primaryColor)]/30 dark:bg-gray-700 rounded-md p-[4px] max-sm:py-3 ${className}`}
    >
      <button
        onClick={(e) => handleUpdateQuantity(e, cartItem.quantity - 1)}
        className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-600 cursor-pointer group transition-colors"
        disabled={loading}
      >
        <Minus size={14} className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
      </button>
      <span className="text-[var(--primaryColor)] dark:text-gray-200 w-8 text-sm text-center font-medium">{cartItem.quantity}</span>
      <button
        onClick={(e) => handleUpdateQuantity(e, cartItem.quantity + 1)}
        className="w-6 h-6 flex items-center justify-center rounded-sm cursor-pointer hover:bg-[var(--primaryColor)] dark:hover:bg-gray-600 group transition-colors"
        disabled={loading}
      >
        <Plus size={14} className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
      </button>
    </div>
  ), [cartItem?.quantity, handleUpdateQuantity, loading]);

  const productUrl = useMemo(() => `/products/${product.category.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")}/${product._id}`, [product]);

  const productContent = (
    <div className="w-full h-fit relative border-1 border-solid border-[var(--primaryColor)] dark:border-gray-700 p-3 rounded-md dark:bg-gray-800">
      {hasDiscount && (
        <div className="absolute -right-3 -top-3 bg-[var(--primaryColor)] dark:bg-[var(--primaryColor)] text-white text-xs font-semibold flex items-center justify-center w-13 h-13 rounded-full p-[3px] z-20">
          <p className='rotate-[-26deg] text-center'>{Math.round((variant.discountPrice / variant.regularPrice) * 100)}% off</p>
        </div>
      )}
      <Link href={showLink ? productUrl : '#'} className="block">
        <div className="w-28 h-28 mx-auto relative mb-4">
          <Image src={product?.images[0]?.url}
            fill
            alt={product?.name}
            className="object-contain hover:scale-[1.1] duration-200"
            sizes="(max-width: 768px) 40px, (max-width: 1200px) 60px, 80px" />
        </div>
        <div className="mb-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product?.category}</p>
          <h3 className="text-lg font-semibold text-[var(--textColor)] dark:text-gray-100">{product?.name}</h3>
          <div className="flex items-center gap-2">
            <Rating name="read-only" value={
              product?.reviews?.length
                ? product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length
                : 0
            } readOnly
              icon={<TiStarFullOutline className="text-lg text-[var(--primaryColor)]" />}
              emptyIcon={<TiStarOutline className="text-lg text-[var(--primaryColor)]" />}
            />
            <span className="text-sm text-[var(--textColor)] dark:text-gray-300">({product?.reviews?.length
              ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
              : 0})</span>
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <p className="text-[var(--primaryColor)] dark:text-[var(--primaryColor)] font-medium text-sm">₹{finalPrice.toFixed(2)}</p>
          {hasDiscount && (
            <span className="text-xs text-[var(--textColor)] dark:text-gray-400 line-through mt-[2px]">
              ₹{variant.regularPrice.toFixed(2)}
            </span>
          )}
        </div>
        {!cartItem ? (
          <div className="max-sm:hidden z-10">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="flex cursor-pointer items-center justify-center gap-2 px-4 py-1 group rounded-md border border-solid border-[var(--primaryColor)] dark:border-gray-600 text-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-700 hover:text-white transition-colors z-10 bg-[var(--primaryColor)]/5 dark:bg-gray-700/50"
            >
              <ShoppingCart className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
              <p className="text-[var(--textColor)] dark:text-gray-200 group-hover:text-white transition-colors">
                {loading ? 'Adding...' : 'Add'}
              </p>
            </button>
          </div>
        ) : (
          <div className="max-sm:hidden z-10">
            <QuantityControls />
          </div>
        )}
      </div>
      {!cartItem ? (
        <div className="sm:hidden mt-3">
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-sm border border-solid border-[var(--primaryColor)] dark:border-gray-600 text-sm dark:bg-gray-700/50"
          >
            <ShoppingCart className="text-[var(--primaryColor)] dark:text-gray-200" />
            <p className="text-[var(--textColor)] dark:text-gray-200">
              {loading ? 'Adding...' : 'Add'}
            </p>
          </button>
        </div>
      ) : (
        <div className="sm:hidden mt-3">
          <QuantityControls className="w-full" />
        </div>
      )}
    </div>
  );

  return (
    <div className="block">
      {productContent}
    </div>
  );
};

export default React.memo(DiscountProductCard);