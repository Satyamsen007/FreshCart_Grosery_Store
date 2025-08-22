'use client'

import { FiInstagram } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import Image from "next/image";
import { assets, multipleCategorySection } from "../../public/assets/assets";
import { Typewriter } from "react-simple-typewriter";
import { RiArrowRightLine } from "react-icons/ri";
import { motion } from 'framer-motion';
import WhyAreTheBestSection from "@/components/custom-components/WhyAreTheBestSection";
import TestimonialSlider from "@/components/custom-components/TestimonialSlider";
import HappyClientsSection from "@/components/custom-components/HappyClientsSection";
import BestSellingProductsSection from "@/components/custom-components/products/BestSellingProductsSection";
import DiscountProductsSection from "@/components/custom-components/products/DiscountProductsSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const HomePage = () => {
  const router = useRouter();
  const socialLinks = [
    { icon: <FiInstagram />, key: 'instagram' },
    { icon: <FaFacebook />, key: 'facebook' },
    { icon: <FaTwitter />, key: 'twitter' },
    { icon: <IoLogoLinkedin />, key: 'linkedin' },
  ];

  return (
    <div className='overflow-hidden dark:bg-gray-900 transition-colors duration-300'>
      <div className="bg-[url('/assets/HomePageImages/HomeBannerBg.png')] dark:bg-none max-sm:bg-[url('/assets/HomePageImages/MobileBannerBg.png')] w-full h-[90vh] max-lg:h-fit bg-center bg-cover bg-no-repeat overflow-hidden relative z-10">
        <div className="flex flex-col items-center justify-center max-lg:h-fit max-sm:pt-10 md:mx-auto lg:mx-0 max-lg:pb-3 h-full w-[80%] max-lg:w-full">
          <div className="lg:w-[60%] md:w-[90%] max-md:w-full dark:lg:w-[90%] sm:pt-10 md:pt-4 lg:pt-0">
            <div>
              <h1 className="xl:text-5xl max-lg:text-xl max-lg:text-center sm:text-2xl max-lg:leading-normal text-[var(--primaryColor)] dark:text-gray-100 font-semibold xl:leading-14 mb-6 max-lg:mb-3">Eat Healthy, Live Fresh with<br />
                <span className="text-[#F9A826] dark:text-[#FFB74D] texttransfor capitalize"><Typewriter
                  words={[
                    'organic groceries',
                    'farm-fresh veggies',
                    'seasonal fruits',
                    'locally-sourced produce',
                    'natural ingredients',
                    'family meal essentials',
                    'budget-friendly packs'
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={80}
                  delaySpeed={1000}
                /></span></h1>
              <p className="xl:text-base max-lg:text-center max-lg:px-5 sm:text-sm max-lg:text-xs text-[var(--textColor)] dark:text-gray-300 dark:lg:w-[70%] font-medium mb-6 max-lg:mb-3"> Discover farm-fresh fruits, crisp vegetables, and pantry essentials—
                delivered fast and hassle-free. Shop healthy, eat better,and save time with
                our trusted grocery delivery service.</p>
            </div>
            <div className="flex items-center max-lg:justify-center gap-3">
              <button onClick={() => router.push('/products')} className="px-6 max-lg:text-xs border border-[var(--primaryColor)] dark:border-gray-100 lg:hover:bg-transparent lg:hover:text-[var(--primaryColor)] dark:hover:text-gray-100 transition-all duration-200 cursor-pointer py-2 xl:text-base sm:text-sm rounded-br-4xl rounded-sm bg-[var(--primaryColor)] dark:bg-gray-800 text-white">Shop Now</button>
              <div className="flex items-center max-lg:text-xs gap-2 xl:text-base sm:text-sm text-[var(--textColor)] dark:text-gray-300 cursor-pointer font-medium lg:hover:text-[var(--primaryColor)] dark:hover:text-gray-100 duration-200 group">
                <p>Download App</p>
                <RiArrowRightLine className="lg:group-hover:translate-x-2 transition-all duration-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full absolute bottom-5 right-7 justify-end max-lg:hidden flex gap-6 z-10">
          {socialLinks.map(({ icon, key }) => (
            <div
              key={key}
              className="max-lg:w-6 max-lg:h-6 sm:w-9 sm:h-9 md:w-8 md:h-8 bg-[var(--primaryColor)] dark:bg-gray-700 flex justify-center items-center text-white rounded-full text-lg cursor-pointer group hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] hover:border hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-200"
            >
              <span className="group-hover:-rotate-y-180 transition-transform duration-500">
                {icon}
              </span>
            </div>
          ))}
        </div>

        <motion.div
          animate={{
            y: [0, -25, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="xl:w-[600px] xl:h-[600px] max-lg:w-[250px] max-lg:h-[250px] lg:w-[440px] lg:h-[440px] lg:absolute right-0 max-lg:mx-auto max-lg:relative max-lg:mt-8 bottom-4 -z-10">
          <Image
            src={assets.HomeBannerAnimateImage}
            alt="Fresh Grocery Banner"
            fill
            priority
            className="object-contain dark:brightness-90"
            sizes="(max-width: 768px) 250px, (max-width: 1200px) 440px, 600px" />

        </motion.div>

      </div>
      <div className="xl:px-5 py-7 px-3">
        <h2 className="text-[var(--textColor)] dark:text-gray-100 text-2xl max-lg:text-xl font-bold mb-6 xl:mb-8">Shop By Categorie</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-4">
          {
            multipleCategorySection.map(({ image, name, bgColor, darkBgColor }, i) => (
              <Link
                href={`/products/${name.toLowerCase().replace(/\s+/g, '-')}`}
                key={i}
                style={{
                  '--light-bg': bgColor,
                  '--dark-bg': darkBgColor,
                }}
                className='group w-full h-[150px] sm:h-[160px] md:h-[170px] xl:h-[180px] rounded-md cursor-pointer flex items-center justify-center flex-col gap-3 transition-all duration-300 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]'
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain group-hover:scale-[1.1] duration-200 dark:brightness-90"
                    sizes="(max-width: 768px) 40px, (max-width: 1200px) 60px, 80px"
                  />
                </div>
                <h4 className="text-sm xl:text-[14px] lg:text-xs text-[var(--textColor)] dark:text-gray-300 font-medium text-center px-2">{name}</h4>
              </Link>
            ))
          }
        </div>
      </div>

      <BestSellingProductsSection />

      <div className="px-3 py-4">
        <div className="flex items-center justify-center max-xl:flex-col gap-10 w-full">
          <div
            className="xl:w-[44%] w-[90%] lg:w-[70%] relative grid grid-cols-[1.8fr_1fr] max-lg:grid-cols-[1fr_0fr] h-[350px] max-lg:h-fit max-lg:py-7 bg-[#FEF6DA] dark:bg-gray-800 rounded-md p-4 transition-all duration-300">
            <div className="flex flex-col justify-center max-lg:items-center gap-4">
              <div className="w-32 py-2 text-[var(--textColor)] dark:text-gray-300 text-sm text-center rounded-md border border-solid border-[var(--primaryColor)] dark:border-gray-100">
                Free Delivery
              </div>
              <div>
                <h3 className="text-3xl text-[var(--primaryColor)] dark:text-gray-100 font-semibold mb-2 max-lg:text-2xl max-lg:text-center">Free Delivery on Orders <br className="max-lg:hidden" />
                  Over $80</h3>
                <p className="text-sm font-medium text-[var(--textColor)] dark:text-gray-300 max-lg:text-center">Enjoy the convenience of doorstep
                  delivery — spend $80 or more and we'll
                  bring the freshness to you for free!</p>
              </div>
              <button className="bg-[var(--primaryColor)] dark:bg-gray-700 text-white w-[60%] px-10 py-3 rounded-[8px] cursor-pointer text-sm max-lg:text-xs lg:hover:bg-transparent border border-[var(--primaryColor)] dark:border-gray-100 lg:hover:text-[var(--primaryColor)] dark:hover:text-gray-100 duration-300">Shop Now</button>
            </div>
            <div className="w-[350px] h-[350px] top-0 right-0 max-lg:hidden absolute">
              <Image src={assets.DeliveryCardImage} alt="" className="w-full h-full object-cover dark:brightness-90" />
            </div>
          </div>

          <div className="xl:w-[44%] w-[90%] lg:w-[70%] relative grid grid-cols-[1.2fr_1fr] max-lg:grid-cols-[1fr_0fr] h-[350px] max-lg:h-fit max-lg:py-7 bg-[#BEFFDC] dark:bg-gray-800 overflow-hidden rounded-md p-4 transition-all duration-300">
            <div className="flex flex-col justify-center max-lg:items-center gap-4">
              <div className="w-32 py-2 text-[var(--textColor)] dark:text-gray-300 text-sm text-center rounded-md border border-solid border-[var(--primaryColor)] dark:border-gray-100">
                Upto 60% off
              </div>
              <div>
                <h3 className="text-3xl text-[var(--primaryColor)] dark:text-gray-100 font-semibold mb-2 max-lg:text-2xl max-lg:text-center">Up to 60% Off Tasty <br className="max-lg:hidden" />
                  Picks</h3>
                <p className="text-sm font-medium text-[var(--textColor)] dark:text-gray-300 max-lg:text-center">Savor your favorites for less—enjoy
                  delicious deals on selected food
                  items today!</p>
              </div>
              <button className="bg-[var(--primaryColor)] dark:bg-gray-700 text-white w-[70%] px-10 py-3 rounded-[8px] cursor-pointer text-sm max-lg:text-xs lg:hover:bg-transparent border border-[var(--primaryColor)] dark:border-gray-100 lg:hover:text-[var(--primaryColor)] dark:hover:text-gray-100 duration-300">Grab the Flavor</button>
            </div>
            <div className="w-[350px] h-[350px] top-0 right-0 max-lg:hidden absolute">
              <Image src={assets.DiscountCardImage} alt="" className="w-full h-full object-cover dark:brightness-90" />
            </div>
          </div>
        </div>
      </div>

      <DiscountProductsSection />

      <WhyAreTheBestSection />
      <TestimonialSlider />
      <HappyClientsSection />
      <div className="w-full h-fit py-10 max-lg:p-0 max-lg:mb-12">
        <div className="xl:w-[60%] max-lg:w-[90%] sm:w-[80%] flex flex-col items-center mx-auto">
          <h3 className="text-3xl max-md:text-2xl font-semibold text-[var(--textColor)] dark:text-gray-100 text-center mb-2">Never Miss a Deal!</h3>
          <p className="text-center text-sm max-md:text-xs text-[var(--textColor)]/60 dark:text-gray-400 mb-8">Subscribe to get the latest offers, new arrivals, and exclusive discounts</p>
          <div className="flex items-center justify-center max-lg:flex-col max-lg:gap-4 w-full">
            <input type="text" placeholder="Enter your email id" className="w-[45%] max-lg:rounded-sm max-lg:w-full text-[var(--primaryColor)] dark:text-gray-300 dark:bg-gray-800 dark:placeholder-gray-500 py-4 outline-none text-base max-lg:text-xs px-3 border border-solid border-[var(--primaryColor)] dark:border-gray-700 rounded-tl-sm rounded-bl-sm focus:ring-2 focus:ring-[var(--primaryColor)] dark:focus:ring-gray-600 transition-all duration-300" />
            <button className="py-4 px-10 max-lg:text-xs cursor-pointer text-white border border-solid rounded-tr-sm rounded-br-sm border-[var(--primaryColor)] dark:border-gray-700 text-center text-base bg-[var(--primaryColor)] dark:bg-gray-700 max-lg:rounded-sm max-lg:w-[60%] hover:bg-[var(--primaryColor)]/90 dark:hover:bg-gray-600 transition-all duration-300">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export with dynamic import for client-side only rendering
export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primaryColor)]"></div>
    </div>
  )
});