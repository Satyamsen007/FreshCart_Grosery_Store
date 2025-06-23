
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiShoppingBasket2Line, RiShoppingCartLine } from 'react-icons/ri';

const EmptyCartUi = () => {
  return (
    <div className="min-h-[80vh] py-20 flex items-center justify-center bg-gradient-to-br from-[#F8FBF9] via-white to-[#E8F5E9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      <div className="text-center px-4 w-full max-w-7xl mx-auto">
        {/* Animated cart illustration with dynamic background */}
        <motion.div
          className="relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-[400px] h-[300px] mx-auto relative mb-12">
            {/* Animated background circles */}
            <motion.div
              className="absolute inset-0 z-0"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[var(--primaryColor)]/5 dark:bg-[#FFB74D]/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-[var(--primaryColor)]/10 dark:bg-[#FFB74D]/20"></div>
            </motion.div>

            {/* Cart icon */}
            <motion.div
              animate={{ y: [0, 26, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 top-24"
            >
              <RiShoppingCartLine className="text-[80px] max-md:text-[60px] text-[var(--primaryColor)]/40 dark:text-[#FFB74D]/40 mx-auto" />
            </motion.div>

            {/* Floating items with improved positioning and animations */}
            {['🥕', '🍅', '🥑', '🥖', '🥛', '🍎', '🍌'].map((item, index) => (
              <motion.span
                key={index}
                className="absolute text-3xl max-md:text-2xl sm:text-4xl z-20"
                style={{
                  top: `${Math.sin(index) * 45 + 50}%`,
                  left: `${Math.cos(index) * 40 + 50}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Main content with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl mx-auto px-4 max-md:px-2"
        >
          <h2 className="text-xl max-md:text-lg md:text-3xl font-bold bg-gradient-to-r from-[var(--primaryColor)] to-emerald-600 dark:from-[#FFB74D] dark:to-emerald-400 bg-clip-text text-transparent mb-6">
            Your Cart is Empty!
          </h2>
          <p className="text-[var(--textColor)]/70 dark:text-gray-300 mb-10 text-sm md:text-base">
            Ready to fill your cart with fresh, healthy delights? Explore our curated selection of premium products for your wellness journey.
          </p>

          {/* Action buttons with enhanced hover effects */}
          <div className="flex max-md:flex-col gap-6 justify-center items-center mb-16">
            <Link href="/products" className="w-full max-md:w-auto">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -5px rgba(74, 222, 128, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-md:w-auto group bg-gradient-to-r from-[var(--primaryColor)] text-base to-emerald-200 dark:from-[#FFB74D] dark:to-emerald-400 text-white px-10 py-4 rounded-full font-medium flex cursor-pointer items-center justify-center gap-3 shadow-lg shadow-[var(--primaryColor)]/20 dark:shadow-[#FFB74D]/20 hover:shadow-xl transition-all duration-300"
              >
                <RiShoppingBasket2Line />
                Start Shopping
                <RiArrowRightLine className="group-hover:translate-x-2 transition-all duration-200" />
              </motion.button>
            </Link>

            <Link href="/" className="w-full max-md:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-md:w-auto backdrop-blur-sm text-base cursor-pointer bg-white/30 dark:bg-gray-800/30 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] text-[var(--primaryColor)] dark:text-[#FFB74D] px-10 py-4 rounded-full font-medium hover:bg-[var(--primaryColor)]/5 dark:hover:bg-[#FFB74D]/10 transition-all duration-300"
              >
                Return Home
              </motion.button>
            </Link>
          </div>

          {/* Enhanced value propositions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: "✨", title: "Premium Quality", desc: "Hand-picked fresh products" },
              { icon: "🚚", title: "Express Delivery", desc: "Free shipping on orders $80+" },
              { icon: "💰", title: "Best Prices", desc: "Competitive market rates" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-xl bg-gradient-to-br from-white to-[var(--primaryColor)]/5 dark:from-gray-800 dark:to-[#FFB74D]/10 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-[var(--primaryColor)] dark:text-[#FFB74D] font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--textColor)]/70 dark:text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default EmptyCartUi