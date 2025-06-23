import React, { useMemo, useCallback } from 'react';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Rating } from '@mui/material';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCartItem } from '@/store/features/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/features/wishlistSlice';
import Link from 'next/link';
import { toast } from 'sonner';

const ProductCard = ({ product, showLink = true }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
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

  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
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

  const handleUpdateQuantity = useCallback(async (e, newQuantity) => {
    e.preventDefault();
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

  const handleWishClick = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const QuantityControls = ({ className = "" }) => (
    <div className={`flex items-center justify-center gap-1 bg-[var(--primaryColor)]/30 dark:bg-gray-700 rounded-md p-[4px] max-sm:py-3 ${className}`}>
      <button
        onClick={(e) => handleUpdateQuantity(e, cartItem.quantity - 1)}
        className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-600 cursor-pointer group transition-colors"
      >
        <Minus size={14} className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
      </button>
      <span onClick={(e) => e.preventDefault()} className="text-[var(--primaryColor)] dark:text-gray-200 w-8 text-sm text-center font-medium">{cartItem.quantity}</span>
      <button
        onClick={(e) => handleUpdateQuantity(e, cartItem.quantity + 1)}
        className="w-6 h-6 flex items-center justify-center rounded-sm cursor-pointer hover:bg-[var(--primaryColor)] dark:hover:bg-gray-600 group transition-colors"
      >
        <Plus size={14} className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
      </button>
    </div>
  );

  const productContent = (
    <div className="w-full h-fit relative border-1 border-solid border-[var(--primaryColor)] dark:border-gray-700 p-3 rounded-md dark:bg-gray-800">
      <button
        onClick={handleWishClick}
        className="absolute right-2 top-2 cursor-pointer z-10"
        disabled={loading}
      >
        <Heart fill={isInWishlist ? '#4FBF8B' : "#D9D9D9"} stroke="none" />
      </button>
      <div>
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
            <span className="text-sm select-none text-[var(--textColor)] dark:text-gray-300">({product?.reviews?.length
              ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
              : 0})</span>
          </div>
        </div>
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
            <div
              onClick={e => e.stopPropagation()}
              className="max-sm:hidden z-10"
            >
              <button
                onClick={handleAddToCart}
                className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-1 group rounded-md border border-solid border-[var(--primaryColor)] dark:border-gray-600 text-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-700 hover:text-white transition-colors z-10 bg-[var(--primaryColor)]/5 dark:bg-gray-700/50`}
              >
                <ShoppingCart className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
                <p className="text-[var(--textColor)] dark:text-gray-200 group-hover:text-white transition-colors">
                  Add
                </p>
              </button>
            </div>
          ) : (
            <div
              onClick={e => e.stopPropagation()}
              className="max-sm:hidden z-10"
            >
              <QuantityControls />
            </div>
          )}
        </div>
        {!cartItem ? (
          <div
            onClick={e => e.stopPropagation()}
            className="sm:hidden mt-3"
          >
            <button
              onClick={handleAddToCart}
              className={`flex w-full items-center justify-center gap-2 px-4 py-3 rounded-sm border border-solid border-[var(--primaryColor)] dark:border-gray-600 text-sm dark:bg-gray-700/50`}
            >
              <ShoppingCart className="text-[var(--primaryColor)] dark:text-gray-200" />
              <p className="text-[var(--textColor)] dark:text-gray-200">Add</p>
            </button>
          </div>
        ) : (
          <div
            onClick={e => e.stopPropagation()}
            className="sm:hidden mt-3"
          >
            <QuantityControls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );

  if (!showLink) {
    return productContent;
  }

  return (
    <Link
      href={`/products/${product.category.toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "-")}/${product._id}`}
      className="block"
    >
      {productContent}
    </Link>
  );
}

export default ProductCard