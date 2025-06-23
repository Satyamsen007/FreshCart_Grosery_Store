'use client'

import Image from 'next/image'
import React from 'react'
import { assets } from '../../../../public/assets/assets'
import { FiInstagram } from 'react-icons/fi'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import { IoLogoLinkedin } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

const Footer = () => {
  const router = useRouter();

  const socialLinks = [
    { icon: <FiInstagram />, key: 'instagram' },
    { icon: <FaFacebook />, key: 'facebook' },
    { icon: <FaTwitter />, key: 'twitter' },
    { icon: <IoLogoLinkedin />, key: 'linkedin' },
  ]

  const quickLinks = [
    'Home',
    'Best Sellers',
    'Offers & Deals',
    'Contact Us',
    'About Us',
  ]

  const helpLinks = [
    'Delivery Information',
    'Return & Refund Policy',
    'Payment Methods',
    'Track Your Order',
    'Contact Us',
  ]

  const followUsLinks = [
    'Instagram',
    'Twitter',
    'Facebook',
    'YouTube',
    'LinkedIn',
  ]
  return (
    <footer className='w-full h-fit py-10 max-sm:mb-10 bg-[#E9F5F1] dark:bg-gray-900'>
      <div className='w-[90%] mx-auto grid xl:grid-cols-[1.5fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr] max-md:grid-cols-1 max-md:place-items-start max-sm:gap-3 sm:gap-5 xl:gap-0 xl:place-items-center'>
        <div className='flex flex-col gap-4 xl:mt-8 mt-0'>
          <div onClick={() => router.push('/')} className="w-[120px] md:w-[130px] xl:w-[140px] cursor-pointer">
            <Image
              src={assets.Logo}
              alt="Page Logo"
              sizes="(max-width: 768px) 120px, (max-width: 1024px) 130px, 140px"
              className="w-full h-full object-contain dark:invert"
            />
          </div>
          <p className='text-sm text-[var(--textColor)]/90 dark:text-gray-300'>We deliver fresh groceries and snacks straight to your door.
            Trusted by thousands, we aim to make your shopping experience
            simple and affordable.</p>
          <div className="w-full max-w-md pb-4 flex flex-wrap gap-4">
            {socialLinks.map(({ icon, key }) => (
              <div
                key={key}
                className="max-sm:w-6 max-sm:h-6 sm:w-9 sm:h-9 md:w-8 md:h-8 bg-[var(--primaryColor)] dark:bg-gray-700 flex justify-center items-center text-white rounded-full text-lg cursor-pointer group hover:bg-transparent hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] hover:border hover:border-[var(--primaryColor)] dark:hover:border-[#FFB74D] transition-all duration-200"
              >
                <span className="group-hover:-rotate-y-180 transition-transform duration-500">
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className='text-2xl text-[var(--textColor)] dark:text-gray-100 font-semibold text-start'>Quick Links</h3>
          <ul className='text-sm flex flex-col text-[var(--textColor)]/90 dark:text-gray-300 gap-1 mt-2'>
            {quickLinks.map((link, index) => (
              <li key={index} className='cursor-pointer hover:text-[var(--primaryColor)] dark:hover:text-[var(--primaryColor)] transition-colors'>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className='text-2xl text-[var(--textColor)] dark:text-gray-100 font-semibold text-start'>Need help?</h3>
          <ul className='text-sm flex flex-col text-[var(--textColor)]/90 dark:text-gray-300 gap-1 mt-2'>
            {helpLinks.map((link, index) => (
              <li key={index} className='cursor-pointer hover:text-[var(--primaryColor)] dark:hover:text-[var(--primaryColor)] transition-colors'>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className='text-2xl text-[var(--textColor)] dark:text-gray-100 font-semibold text-start'>Follow Us</h3>
          <ul className='text-sm flex flex-col text-[var(--textColor)]/90 dark:text-gray-300 gap-1 mt-2'>
            {followUsLinks.map((link, index) => (
              <li key={index} className='cursor-pointer hover:text-[var(--primaryColor)] dark:hover:text-[var(--primaryColor)] transition-colors'>{link}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className='w-[80%] h-[2px] bg-[#AFB5B3]/40 dark:bg-gray-700 mt-8 mb-4 mx-auto'></div>
      <p className='text-sm text-center text-[var(--textColor)]/90 dark:text-gray-400'>Copyright 2025 © FreshCart All Right Reserved.</p>
    </footer>
  )
}

export default Footer