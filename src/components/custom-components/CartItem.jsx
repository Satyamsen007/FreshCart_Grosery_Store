'use client';
import { motion } from 'framer-motion'
import { X } from 'lucide-react';
import Image from 'next/image';

const CartItem = ({ product, onQuantityChange, onRemove }) => {
  const subtotal = product.price * product.quantity;
  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: -100,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      className="border-2 w-full px-4 py-3 mt-5 mb-8 rounded-2xl border-[var(--primaryColor)] relative dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex relative items-center gap-3">
          <div className="h-20 w-20 relative flex-shrink-0">
            <Image
              src={product.image || '/placeholder-product.png'}
              alt={product.name}
              fill
              className="object-contain dark:brightness-90"
              sizes="(max-width: 768px) 80px, 80px"
              loading="lazy"
              quality={75}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm text-[var(--textColor)] dark:text-gray-100">{product.name}</h3>
            {product.variantName && (
              <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">{product.variantName}</p>
            )}
            <p className="text-sm text-[var(--textColor)]/90 mt-1 dark:text-gray-300">₹{product.price?.toFixed(2)}</p>
          </div>
          <button
            onClick={onRemove}
            className="absolute -top-3 -right-4 bg-[var(--primaryColor)] p-1 text-white rounded-tr-lg rounded-bl-sm font-semibold cursor-pointer hover:text-red-500 transition-colors dark:bg-[#FFB74D] dark:hover:text-white dark:hover:bg-red-500"
            aria-label="Remove item"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border-2 font-semibold border-[var(--primaryColor)] rounded-xl justify-evenly gap-2 dark:border-gray-600">
            <button
              onClick={() => onQuantityChange(product.quantity - 1)}
              className="w-8 h-8 border-r-2 cursor-pointer border-[var(--primaryColor)] text-[var(--primaryColor)] disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300"
              disabled={product.quantity <= 1}
            >
              -
            </button>
            <span className="w-8 text-[var(--primaryColor)] text-center dark:text-gray-300">{product.quantity}</span>
            <button
              onClick={() => onQuantityChange(product.quantity + 1)}
              className="w-8 h-8 border-l-2 cursor-pointer border-[var(--primaryColor)] text-[var(--primaryColor)] dark:border-gray-600 dark:text-gray-300"
            >
              +
            </button>
          </div>
          <div className="text-[var(--textColor)]/90 font-medium dark:text-gray-300">
            ₹{subtotal?.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center">
        <div className="font-medium w-[45%]">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 relative">
              <Image
                src={product.image || '/placeholder-product.png'}
                alt={product.name}
                fill
                className="object-contain dark:brightness-90"
                sizes="(max-width: 768px) 80px, 80px"
                loading="lazy"
                quality={75}
              />
            </div>
            <div>
              <h3 className="font-medium text-sm text-[var(--textColor)] dark:text-gray-100">{product.name}</h3>
              {product.variantName && (
                <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-400">{product.variantName}</p>
              )}
            </div>
          </div>
        </div>
        <div className="text-center w-[15%] text-sm text-[var(--textColor)]/90 dark:text-gray-300">
          ₹{product.price?.toFixed(2)}
        </div>
        <div className="text-center w-[20%]">
          <div className="flex items-center border-2 font-semibold border-[var(--primaryColor)] rounded-xl justify-evenly gap-2 dark:border-gray-600">
            <button
              onClick={() => onQuantityChange(product.quantity - 1)}
              className="w-8 h-8 border-r-2 cursor-pointer border-[var(--primaryColor)] text-[var(--primaryColor)] disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300"
              disabled={product.quantity <= 1}
            >
              -
            </button>
            <span className="w-8 text-[var(--primaryColor)] text-center dark:text-gray-300">{product.quantity}</span>
            <button
              onClick={() => onQuantityChange(product.quantity + 1)}
              className="w-8 h-8 border-l-2 cursor-pointer border-[var(--primaryColor)] text-[var(--primaryColor)] dark:border-gray-600 dark:text-gray-300"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-center w-[20%] text-[var(--textColor)]/90 dark:text-gray-300">
          <div className="flex text-sm items-center justify-center gap-7">
            <span>₹{subtotal?.toFixed(2)}</span>
            <button
              onClick={onRemove}
              className="text-[var(--primaryColor)] font-semibold cursor-pointer hover:text-red-500 transition-colors dark:text-[#FFB74D] dark:hover:text-red-500 dark:hover:bg-red-500/10 dark:p-1 dark:rounded-full"
              aria-label="Remove item"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem

