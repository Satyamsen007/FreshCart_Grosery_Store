import Image from 'next/image'
import React, { useState } from 'react'
import { assets } from '../../../../public/assets/assets'
import { useForm } from 'react-hook-form';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from 'react-icons/fa6';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { RiArrowLeftLine } from 'react-icons/ri';
import { toast } from 'sonner';

const SignUpForm = ({ setAuthState }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSignUp(true)
      const response = await axios.post("/api/sign-up", data);
      if (response.data.success) {
        toast.success('Account created successfully! Signing you in...', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });

        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInResult.ok) {
          router.push('/');
          toast.success('Welcome aboard! You are now signed in.', {
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
          toast.error(signInResult?.error || 'Sign in failed. Please check your credentials and try again.', {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        }
      } else {
        toast.error(response.data.message || 'Sign up failed. Please try again.', {
          position: 'top-center',
          autoClose: 4000,
          theme: 'colored',
        });
      }
    } catch (error) {
      if (error?.response?.data?.message === 'A user with this email already exists.') {
        setError("email", {
          type: "server",
          message: "This email is already registered.",
        });
      } else {
        toast.error('An unexpected error occurred. Please try again later.', {
          position: 'top-center',
          autoClose: 4000,
          theme: 'colored',
        });
        console.error('Signup error:', error);
      }
    } finally {
      setIsSignUp(false)
    }
  };

  const signinWithGoogle = async () => {
    setIsSignUp(true)
    const result = await signIn('google')
    if (result?.ok) {
      toast.success('Welcome back! You have successfully signed in.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      router.push('/');
    } else {
      console.error("Google Sign-In Error:", result.error);
      toast.error("Failed to sign in with Google. Please try again later.");
    }
    setIsSignUp(false);
  }

  return (
    <div className='lg:pt-6 pb-20 sm:pb-5 lg:pb-0'>
      <div onClick={() => router.back()} className='text-[#4FBF8B] dark:text-[#FFB74D] font-semibold text-xl xl:w-[20%] w-[30%] max-sm:w-[50%] mb-4 flex items-center gap-2 select-none group cursor-pointer'>
        <RiArrowLeftLine className='group-hover:-translate-x-1 transition-all duration-200 ease-in-out' />
        <p>Go Back</p>
      </div>
      <h2 className='text-[#364153] dark:text-gray-100 font-bold text-3xl xl:text-3xl lg:text-2xl mb-4'>Create Account</h2>
      <p className='text-[#4FBF8B] dark:text-[#FFB74D] text-sm xl:text-[14px] lg:text-xs font-semibold mb-3 xl:mb-5 lg:mb-3'>Join now — because every great meal starts with fresh groceries!</p>
      <div className='flex items-center justify-center max-lg:flex-col gap-5 mt-5 xl:mt-8 lg:mt-5'>
        <div onClick={signinWithGoogle} className='flex items-center justify-center gap-2 border border-solid border-[#4FBF8B] dark:border-[#FFB74D] cursor-pointer py-3 rounded-full w-full hover:bg-[#4FBF8B]/5 dark:hover:bg-[#FFB74D]/5 transition-colors duration-200'>
          <Image src={assets.GoogleLogo} alt='' width={40} height={40} className='w-7 h-7 xl:w-7 xl:h-7 lg:w-5 lg:h-5 object-contain' />
          <h4 className='text-[#364153] dark:text-gray-100 text-sm xl:text-[14px] lg:text-xs font-semibold'>Sign in with Google</h4>
        </div>
      </div>
      <div className='flex items-center justify-center py-6 xl:py-6 lg:py-4 text-base xl:text-base lg:text-sm font-semibold text-[#4FBF8B] dark:text-[#FFB74D]'>
        <h3 className="relative after:content-[''] after:w-4 after:h-[2px] after:bg-[#4FBF8B] dark:after:bg-[#FFB74D] after:absolute after:-left-7 after:top-1/2 before:content-[''] before:w-4 before:h-[2px] before:bg-[#4FBF8B] dark:before:bg-[#FFB74D] before:absolute before:-right-7 before:top-1/2">OR</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 xl:gap-8 lg:gap-6'>

        {/* Full Name Field */}
        <div className="relative w-full">
          {/* Label */}
          <label
            htmlFor="fullName"
            className="absolute -top-2 left-8 bg-white dark:bg-gray-800 px-1 text-sm xl:text-sm lg:text-xs text-[#4FBF8B] dark:text-[#FFB74D]"
          >
            Full Name
          </label>

          {/* Input */}
          <input
            id="fullName"
            type="text"
            {...register('fullName', { required: 'Full Name is required' })}
            className="border border-solid text-[#364153] dark:text-gray-100 border-[#4FBF8B] dark:border-[#FFB74D] px-4 py-[16px] rounded-[12px] text-sm xl:text-[14px] lg:text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#4FBF8B]/20 dark:focus:ring-[#FFB74D]/20 bg-white dark:bg-gray-800"
          />

          {/* Error Message */}
          {errors.fullName && (
            <p className="text-red-500 text-sm xl:text-sm lg:text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="relative w-full">
          {/* Label */}
          <label
            htmlFor="email"
            className="absolute -top-2 left-8 bg-white dark:bg-gray-800 px-1 text-sm xl:text-sm lg:text-xs text-[#4FBF8B] dark:text-[#FFB74D]"
          >
            Email
          </label>

          {/* Input */}
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="border border-solid text-[#364153] dark:text-gray-100 border-[#4FBF8B] dark:border-[#FFB74D] px-4 py-[16px] rounded-[12px] text-sm xl:text-[14px] lg:text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#4FBF8B]/20 dark:focus:ring-[#FFB74D]/20 bg-white dark:bg-gray-800"
          />

          {/* Error Message */}
          {errors.email && (
            <p className="text-red-500 text-sm xl:text-sm lg:text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative w-full">
          {/* Label */}
          <label
            htmlFor="password"
            className="absolute z-10 -top-2 left-8 bg-white dark:bg-gray-800 px-1 text-sm xl:text-sm lg:text-xs text-[#4FBF8B] dark:text-[#FFB74D]"
          >
            Password
          </label>

          <div className='flex items-center relative'>
            {/* Input */}
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className="border text-[#364153] dark:text-gray-100 border-solid border-[#4FBF8B] dark:border-[#FFB74D] pl-4 pr-14 py-[16px] rounded-[12px] text-sm xl:text-[14px] lg:text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#4FBF8B]/20 dark:focus:ring-[#FFB74D]/20 bg-white dark:bg-gray-800"
            />

            {/* Eye */}
            <div onClick={() => setShowPassword((prev) => !prev)} className='absolute right-4 text-xl xl:text-xl lg:text-base text-[#4FBF8B] dark:text-[#FFB74D] cursor-pointer'>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Error Message */}
          {errors.password && (
            <p className="text-red-500 text-sm xl:text-sm lg:text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSignUp}
          className="w-1/2 max-sm:w-[70%] xl:text-lg lg:text-sm border-2 border-[#4FBF8B] dark:border-[#FFB74D] mx-auto bg-[#4FBF8B] dark:bg-[#FFB74D] rounded-[10px] flex items-center justify-center py-3 text-white cursor-pointer hover:bg-transparent hover:text-[#4FBF8B] dark:hover:bg-transparent dark:hover:text-[#FFB74D] transition-all duration-200"
        >
          {isSignUp ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
          ) : 'Create Account'}
        </button>
      </form>
      <h3 className='text-base xl:text-base lg:text-xs text-[#364153] dark:text-gray-100 font-semibold mt-6'>
        Already have an account?{' '}
        <span
          className='text-[#4FBF8B] dark:text-[#FFB74D] cursor-pointer select-none hover:underline'
          onClick={() => setAuthState('sign-in')}
        >
          Sign in
        </span>
      </h3>
    </div >
  )
}

export default SignUpForm