'use client'
import { useState } from 'react';
import Image from 'next/image';
import SignInForm from '@/components/custom-components/auth/SignInForm';
import SignUpForm from '@/components/custom-components/auth/SignUpForm';
import { assets } from '../../public/assets/assets';

export default function AuthPage() {
  const [authState, setAuthState] = useState('sign-in')
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='w-full h-auto flex justify-between items-center max-lg:flex-col-reverse gap-12 lg:gap-20'>
          <div className='w-full lg:w-[55%] xl:w-[60%] bg-white dark:bg-gray-800 rounded-2xl dark:shadow-lg p-6 sm:p-8 lg:p-10'>
            {
              authState === 'sign-in' ? <SignInForm setAuthState={setAuthState} /> : <SignUpForm setAuthState={setAuthState} />
            }
          </div>
          <div className='w-full lg:w-[45%] xl:w-[40%] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] hidden md:block'>
            <Image
              src={assets.AuthentiCationFormImage}
              alt='Authentication illustration'
              width={600}
              height={600}
              className='w-full h-full object-contain drop-shadow-2xl'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
