'use client'

import dynamic from 'next/dynamic';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/hooks/useProduct';
import { Rating } from '@mui/material';
import Image from 'next/image';
import { GrHomeRounded } from "react-icons/gr";
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { FaLocationDot } from "react-icons/fa6";
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { useSession } from 'next-auth/react';
import { parseProductDescription } from '@/helper/parseProductDescription';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCartItem } from '@/store/features/cartSlice';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

import CommentSection from '@/components/custom-components/CommentSection';

// Quantity Controls Component
const QuantityControls = React.memo(({ quantity, onUpdate, className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-1 bg-[var(--primaryColor)]/30 dark:bg-gray-700 rounded-md p-[4px] max-sm:py-3 ${className}`}>
      <button
        onClick={() => onUpdate(quantity - 1)}
        className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-600 cursor-pointer group transition-colors"
      >
        <Minus size={14} className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
      </button>
      <span className="text-[var(--primaryColor)] dark:text-gray-200 w-8 text-sm text-center font-medium">{quantity}</span>
      <button
        onClick={() => onUpdate(quantity + 1)}
        className="w-6 h-6 flex items-center justify-center rounded-sm cursor-pointer hover:bg-[var(--primaryColor)] dark:hover:bg-gray-600 group transition-colors"
      >
        <Plus size={14} className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
      </button>
    </div>
  );
});

QuantityControls.displayName = 'QuantityControls';

const ZoomableImage = React.memo(({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsZoomed(true), []);
  const handleMouseLeave = useCallback(() => setIsZoomed(false), []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={src}
          alt={alt}
          width={400}
          height={320}
          className='w-full h-full object-contain'
          priority={true}
          quality={75}
        />
      </div>

      {isZoomed && (
        <div className="absolute max-md:hidden left-[105%] top-0 w-[400px] h-[400px] border-2 border-[var(--primaryColor)]/30 rounded-md overflow-hidden bg-white shadow-lg z-50">
          <div
            className="w-[200%] h-[200%] relative"
            style={{
              transform: `translate(-${position.x}%, -${position.y}%)`,
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={800}
              height={800}
              className='w-full h-full object-contain scale-90'
              priority={true}
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  );
});

ZoomableImage.displayName = 'ZoomableImage';


const ProductDetailsPage = ({ productCategory, productId }) => {
  const { product, loading, error } = useProduct(productCategory, productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.address);
  const { items: cartItems } = useSelector((state) => state.cart);
  const router = useRouter();

  // Memoized values
  const images = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images;
  }, [product?.images]);

  // Reset selected image when product changes
  useEffect(() => {
    if (product?._id) {
      setSelectedImageIndex(0);
    }
  }, [product?._id]);

  const currentVariant = useMemo(() => product?.variants?.[selectedVariant] || {}, [product, selectedVariant]);

  const hasDiscount = useMemo(() =>
    currentVariant?.isDiscountActive &&
    currentVariant?.discountPrice &&
    currentVariant?.discountPrice < currentVariant?.regularPrice,
    [currentVariant]
  );

  const finalPrice = useMemo(() =>
    hasDiscount && currentVariant?.regularPrice
      ? currentVariant.regularPrice - currentVariant.discountPrice
      : currentVariant?.regularPrice || 0,
    [hasDiscount, currentVariant]
  );

  const averageRating = useMemo(() =>
    product?.reviews?.length
      ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
      : 0,
    [product?.reviews]
  );

  const cartItem = useMemo(() =>
    cartItems.find(item =>
      item.productId === product?._id &&
      item.variantId === currentVariant?._id
    ),
    [cartItems, product?._id, currentVariant?._id]
  );

  // Handlers
  const handleAddToCart = useCallback(() => {
    dispatch(addToCart({
      product,
      variantId: currentVariant._id,
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
  }, [dispatch, product, currentVariant._id]);

  const handleUpdateQuantity = useCallback((newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({
      productId: product._id,
      variantId: currentVariant._id,
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
  }, [dispatch, product?._id, currentVariant._id]);

  const generateShortDescription = (fullDescription) => {
    if (!fullDescription) return '';
    const cleanText = fullDescription.replace(/[^\w\s.,-]/g, '');
    const sentences = cleanText.split('.').map(s => s.trim()).filter(s => s.length > 20);
    const summarySentences = sentences.slice(0, 2);
    return summarySentences.join('. ') + '.';
  }

  const parsed = parseProductDescription(product?.description);

  if (loading || status === 'loading') {
    return (
      <div className='px-10 py-7 max-sm:px-6 dark:bg-gray-900'>
        <div className='flex items-center gap-2'>
          <Skeleton className="h-4 w-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
          <Skeleton className="h-4 w-48 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
        </div>

        <div className='flex flex-col lg:flex-row justify-evenly mt-8 gap-6'>
          <div className='flex flex-[1] flex-col gap-6'>
            <Skeleton className="h-[320px] w-full rounded-md bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            <div className='flex gap-4 items-center justify-between max-sm:grid max-sm:grid-cols-2'>
              {[1, 2, 3, 4].map((_, i) => (
                <Skeleton key={i} className="h-[80px] w-full rounded-md bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              ))}
            </div>
          </div>

          <div className='flex-[1.3]'>
            <div className='flex flex-col gap-2 mb-3'>
              <Skeleton className="h-8 w-3/4 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              <Skeleton className="h-4 w-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            </div>

            <div className='flex items-center gap-2 mb-4'>
              <Skeleton className="h-5 w-32 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              <Skeleton className="h-4 w-16 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            </div>

            <div className='mt-3'>
              <Skeleton className="h-4 w-24 mb-2 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              <div className='flex items-center gap-3'>
                <Skeleton className="h-6 w-32 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-4 w-16 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>
            </div>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className="h-4 w-4 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-10 w-[40%] bg-[var(--primaryColor)]/50 dark:bg-gray-700" />

              <div className='flex justify-between w-[70%] items-center'>
                <Skeleton className="h-4 w-20 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>

              <div className='flex justify-between w-[70%] items-center'>
                <Skeleton className="h-4 w-24 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-4 w-16 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>

              <div className='flex flex-col gap-2'>
                <Skeleton className="h-4 w-32 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <div className='flex items-center justify-between w-[40%]'>
                  <Skeleton className="h-4 w-48 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-16 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-24 mb-2 bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <div className='flex items-center justify-around gap-9 w-[60%]'>
                  {[1, 2].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between w-[80%] gap-5'>
                <Skeleton className="h-14 w-[50%] bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
                <Skeleton className="h-14 w-[50%] bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h2 className="text-xl font-semibold text-red-500 dark:text-red-400 mb-4">Failed to load product</h2>
        <p className="text-[var(--textColor)]/70 dark:text-gray-300 mb-4">{error.message || 'Please try again later'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[var(--primaryColor)] dark:bg-[#FFB74D] cursor-pointer text-white rounded-md hover:bg-[var(--primaryColor)]/90 dark:hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='px-10 py-7 max-sm:px-6 dark:bg-gray-900'>
      <div>
        <div className='flex items-center gap-2 text-sm max-sm:flex-col max-sm:gap-2 max-sm:text-center text-[var(--textColor)] font-medium dark:text-gray-300'>
          <GrHomeRounded />
          <p>/ Products / {productCategory} / {product?.name}</p>
        </div>

        <div className='flex flex-col lg:flex-row justify-evenly mt-8 gap-6'>
          <div className='flex flex-[1] flex-col gap-6'>
            <div className='w-full h-[320px] p-6 border-2 border-[var(--primaryColor)]/30 rounded-md dark:border-gray-700 dark:bg-gray-800'>
              {images[selectedImageIndex]?.url && (
                <ZoomableImage
                  src={images[selectedImageIndex].url}
                  alt={`${product?.name || 'Product'} - Image ${selectedImageIndex + 1}`}
                />
              )}
            </div>

            {images.length > 1 && (
              <div className='flex gap-4 items-center justify-between max-sm:grid max-sm:grid-cols-2'>
                {images.slice(0, 4).map((img, index) => (
                  <div
                    key={`${product?._id}-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-full cursor-pointer transition-colors h-[80px] border-2 rounded-md ${selectedImageIndex === index
                      ? 'border-[var(--primaryColor)] dark:border-[#FFB74D]'
                      : 'border-[var(--primaryColor)]/30 dark:border-gray-700'
                      }`}
                  >
                    {img.url && (
                      <Image
                        src={img.url}
                        alt={`${product?.name || "Product"} thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className='w-full h-full object-contain dark:brightness-90'
                        loading="lazy"
                        quality={60}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className='flex-[1.3]'>
            <div className='flex flex-col gap-2 mb-3'>
              <h1 className='text-2xl max-sm:text-xl font-semibold text-[var(--textColor)] dark:text-gray-100'>{product?.name}</h1>
              <p className='text-sm max-sm:text-xs text-[var(--textColor)]/90 dark:text-gray-400'>
                {generateShortDescription(product?.description)}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <Rating
                name="read-only"
                value={parseFloat(averageRating)}
                readOnly
                icon={<TiStarFullOutline className="text-base text-[var(--primaryColor)] dark:text-[#FFB74D]" />}
                emptyIcon={<TiStarOutline className="text-base text-[var(--primaryColor)] dark:text-[#FFB74D]" />}
              />
              <span className="text-sm select-none text-[var(--textColor)]/70 dark:text-gray-400">
                ({averageRating})
              </span>
              <span className='text-sm text-[var(--textColor)]/70 dark:text-gray-400'>
                {product?.reviews?.length || 0} reviews
              </span>
            </div>

            <div className='mt-3'>
              <p className='text-sm text-[var(--primaryColor)] font-semibold dark:text-[#FFB74D]'>Special price</p>
              <div className='flex items-center gap-3 mt-2'>
                <h2 className='text-xl text-[var(--textColor)] font-semibold dark:text-gray-100'>MRP: ₹{finalPrice}</h2>
                {hasDiscount && currentVariant?.regularPrice ? (
                  <>
                    <span className='text-sm line-through text-[var(--textColor)]/70 dark:text-gray-400'>
                      MRP: ₹{currentVariant.regularPrice}
                    </span>
                    <span className='text-sm text-[var(--primaryColor)] dark:text-[#FFB74D] font-medium'>
                      ({Math.round(100 - (currentVariant.discountPrice / currentVariant.regularPrice * 100))}% off)
                    </span>
                    <span className='border select-none text-[var(--textColor)]/60 text-[10px] text-center border-[var(--textColor)]/60 w-4 h-4 rounded-full dark:border-gray-400 dark:text-gray-400'>
                      !
                    </span>
                  </>
                ) : ''}
              </div>
            </div>
            <div className='mt-3 flex flex-col gap-3'>
              <div className='flex items-center gap-2 text-sm'>
                <FaLocationDot className='text-[var(--primaryColor)] text-base dark:text-[#FFB74D]' />
                <p className='text-[var(--textColor)]/60 dark:text-gray-400'>Deliver To</p>
              </div>
              <div className='w-[40%] max-md:w-full relative flex items-center'>
                <input
                  type="number"
                  placeholder='Enter your pin code'
                  className='pr-22 outline-none pl-2 py-3 w-full text-sm text-[var(--textColor)]/90 border-2 border-[var(--primaryColor)]/30 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400'
                />
                <span className='absolute border-2 border-[var(--primaryColor)]/30 bg-[var(--primaryColor)] right-0 w-[25%] py-3 cursor-pointer rounded-tr-lg text-sm text-white rounded-br-lg text-center dark:bg-[#FFB74D] dark:border-[#FFB74D]'>Check</span>
              </div>

              <div className='flex justify-between max-md:flex-col max-md:mx-auto mt-2 w-[70%] items-center'>
                <h3 className='text-sm text-[var(--textColor)]/60 dark:text-gray-400'>
                  Services
                </h3>
                <span className='flex items-center justify-between gap-2 text-sm'>
                  <RiMoneyRupeeCircleFill className='text-[var(--primaryColor)] dark:text-[#FFB74D]' />
                  <p className='text-[var(--textColor)] dark:text-gray-300'>Cash on Delivery available</p>
                  <span className='border max-md:hidden select-none text-[var(--textColor)]/60 text-[10px] text-center border-[var(--textColor)]/60 w-[14px] h-[14px] rounded-full dark:border-gray-400 dark:text-gray-400'>
                    ?
                  </span>
                </span>
              </div>

              <div className='flex justify-between max-md:w-full  w-[70%] items-center'>
                <h3 className='text-sm text-[var(--textColor)]/60 dark:text-gray-400'>
                  Shipping Fee
                </h3>
                <span className='flex items-center justify-between gap-2 text-sm'>
                  <RiMoneyRupeeCircleFill className='text-[var(--primaryColor)] dark:text-[#FFB74D]' />
                  <span className='text-[var(--textColor)] dark:text-gray-300'>{currentVariant?.shippingFee === 0 ? 'Free' : `₹${currentVariant?.shippingFee}`}</span>
                </span>
              </div>

              <div className={`flex flex-col gap-2 ${!session ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className='text-sm text-[var(--textColor)]/60 dark:text-gray-400'>Delivery Address</h3>
                <div className='flex items-center justify-between w-[40%] max-md:grid max-md:grid-cols-[1.8fr_0.8fr] max-md:w-full'>
                  {addresses?.find(addr => addr.isPrimary) ? (
                    <>
                      <p className='text-sm text-[var(--textColor)] dark:text-gray-300'>
                        {addresses.find(addr => addr.isPrimary).contact.name}, {addresses.find(addr => addr.isPrimary).street}, {addresses.find(addr => addr.isPrimary).city}, {addresses.find(addr => addr.isPrimary).state} - {addresses.find(addr => addr.isPrimary).postalCode}
                      </p>
                      <Link href="/delivery-addresses" className='text-sm text-[var(--primaryColor)] cursor-pointer select-none dark:text-[#FFB74D]'>
                        Change
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className='text-sm text-[var(--textColor)] dark:text-gray-300'>No delivery address set</p>
                      <Link href="/delivery-addresses" className='text-sm text-[var(--primaryColor)] cursor-pointer select-none dark:text-[#FFB74D]'>
                        Add Address
                      </Link>
                    </>
                  )}
                </div>
                {!session && (
                  <p className="text-xs text-[var(--primaryColor)] dark:text-[#FFB74D]">Please login to set delivery address</p>
                )}
              </div>
              <div>
                <h3 className='text-sm text-[var(--textColor)]/60 max-sm:mb-1 dark:text-gray-400'>Select Weight</h3>
                <div className='flex items-center justify-around gap-9 w-[60%] max-md:w-full max-sm:gap-4 mt-2'>
                  {
                    product?.variants?.map((variant, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`flex w-full h-10 text-sm border-2 ${selectedVariant === index
                          ? 'border-[var(--primaryColor)] dark:border-[#FFB74D]'
                          : 'border-[var(--primaryColor)]/30 dark:border-gray-700'
                          } font-medium cursor-pointer rounded-sm text-[var(--primaryColor)] dark:text-[#FFB74D] items-center justify-center`}
                      >
                        {variant.weight}
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className='flex items-center text-sm justify-between w-[80%] max-md:w-full gap-5 mt-4'>
                {cartItem ? (
                  <div className='w-[50%]'>
                    <QuantityControls
                      quantity={cartItem.quantity}
                      onUpdate={handleUpdateQuantity}
                      className="w-full h-14 sm:p-[4px] max-sm:py-3"
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className='flex w-[50%] h-14 items-center justify-center gap-2 px-4 py-3 rounded-md border border-solid border-[var(--primaryColor)] dark:border-gray-600 text-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-700 hover:text-white transition-colors z-10 bg-[var(--primaryColor)]/5 dark:bg-gray-700/50 cursor-pointer'
                  >
                    <ShoppingCart className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
                    <p className="text-[var(--textColor)] dark:text-gray-200 group-hover:text-white transition-colors">
                      Add to Cart
                    </p>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleAddToCart();
                    router.push('/cart');
                  }}
                  className='w-[50%] h-14 flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-solid border-[var(--primaryColor)] dark:border-gray-600 text-sm hover:bg-[var(--primaryColor)] dark:hover:bg-gray-700 hover:text-white transition-colors z-10 bg-[var(--primaryColor)]/5 dark:bg-gray-700/50 cursor-pointer'
                >
                  <ShoppingCart className="text-[var(--primaryColor)] dark:text-gray-200 group-hover:text-white transition-colors" />
                  <p className="text-[var(--textColor)] dark:text-gray-200 group-hover:text-white transition-colors">
                    Grab It Now
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 max-sm:mt-10 max-w-7xl mx-auto px-4 max-md:p-0">
        {/* About Product Section */}
        <div className="mb-10 max-sm:mb-5 text-center">
          <h3 className="text-2xl max-sm:text-xl font-semibold text-[var(--textColor)] dark:text-gray-100">About Product</h3>
          <div className="w-16 h-[2px] bg-[var(--primaryColor)] dark:bg-[#FFB74D] mx-auto mt-3 max-sm:mt-2"></div>
        </div>

        <div className="space-y-3 text-base max-sm:text-sm leading-relaxed text-[var(--textColor)]/90 dark:text-gray-300">
          {product?.description?.split('\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Add Comments Section */}
        <CommentSection productId={product?._id} reviews={product?.reviews} />
      </div>
    </div>
  );
}

// Export with dynamic import for client-side only rendering
export default dynamic(() => Promise.resolve(ProductDetailsPage), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primaryColor)]"></div>
    </div>
  )
});