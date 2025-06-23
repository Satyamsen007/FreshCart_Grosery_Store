'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../../../../public/assets/assets'
import { IoSearch } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { BiMenuAltRight } from "react-icons/bi";
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { CgProfile } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, HelpCircle, LayoutDashboard, LogOut, MapPin, Moon, PackageSearch, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import { FaGithub } from 'react-icons/fa';
import { setFilters } from '@/store/features/getAllProductsSlice';
import { toast } from 'sonner';

const Navbar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [openMenuBar, setOpenMenuBar] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [showInput, setShowInput] = useState(false);
  const { data: session, status } = useSession()
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();

    // Trim the search input to remove whitespace
    const trimmedSearch = searchInput.trim();

    // Only proceed if there's actual search content
    if (!trimmedSearch) {
      toast.error('Please enter a search term');
      return;
    }

    // Navigate to products page with search query parameter
    router.push(`/products?search=${encodeURIComponent(trimmedSearch)}`);

    // Set the filter after navigation
    dispatch(setFilters({ search: trimmedSearch }));
  };

  const clearSearch = () => {
    setSearchInput('');
    dispatch(setFilters({ search: '' }));
  };

  const navRefs = useRef([]);
  const menuItems = ['Home', 'About Us', 'All Products', 'Contact Us'];
  const menuRoutes = ['/', '/about-us', '/products', '/contact-us'];
  const { setTheme, theme } = useTheme()

  const searchVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  useEffect(() => {
    const updateUnderline = () => {
      const currentEl = navRefs.current[activeIndex];
      if (currentEl) {
        setUnderlineStyle({
          width: currentEl.offsetWidth,
          left: currentEl.offsetLeft,
        });
      }
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeIndex, session]);

  useEffect(() => {
    const index = menuRoutes.findIndex(route => pathname === route);
    if (index !== -1) {
      setActiveIndex(index);
    } else {
      setActiveIndex(null);
    }
  }, [pathname]);

  const { items } = useSelector(state => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <div className='w-full h-fit flex items-center lg:p-3 max-lg:px-3 max-lg:py-5 shadow sticky top-0 left-0 z-[1000] bg-white dark:bg-gray-900 border-b dark:border-gray-800'>
      <div className='flex justify-between items-center flex-1 xl:py-1'>
        <div onClick={() => router.push('/')} className="w-[120px] md:w-[130px] xl:w-[140px] lg:ml-7 cursor-pointer">
          <Image
            src={assets.Logo}
            alt="Page Logo"
            sizes="(max-width: 768px) 120px, (max-width: 1024px) 130px, 140px"
            className="w-full h-full object-contain dark:invert"
          />
        </div>

        <div className='flex items-center gap-6'>
          <div>
            <ul className={`flex justify-center items-center gap-8 text-[var(--textColor)] dark:text-gray-200 font-medium max-lg:flex-col max-lg:fixed max-lg:w-[70%] max-lg:bg-white dark:max-lg:bg-gray-900 max-lg:p-0 transition-transform duration-300 ease-in-out ${openMenuBar ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full'} transform max-lg:top-0 max-lg:right-0 max-lg:z-50 max-lg:h-[60vh] max-lg:border max-lg:border-solid max-lg:border-[var(--primaryColor)] dark:max-lg:border-[#FFB74D] max-lg:rounded-tl-2xl max-lg:rounded-bl-2xl duration-300`}>
              <div className='absolute top-2 text-2xl right-2 text-[var(--primaryColor)] dark:text-[#FFB74D] lg:hidden cursor-pointer' onClick={() => setOpenMenuBar(false)}>
                <IoCloseCircle />
              </div>

              {menuItems.map((item, index) => (
                <li
                  key={index}
                  ref={(el) => (navRefs.current[index] = el)}
                  className={`cursor-pointer duration-300 text-sm select-none ${activeIndex === index ? 'text-[var(--primaryColor)] dark:text-[#FFB74D]' : ''}`}
                  onClick={() => {
                    setActiveIndex(index)
                    router.push(menuRoutes[index]);
                    setOpenMenuBar(false);
                  }}
                >
                  {item}
                </li>
              ))}

              {activeIndex !== null && (
                <span
                  className='absolute bottom-0 h-[4px] rounded-bl-4xl rounded-br-4xl bg-[var(--primaryColor)] dark:bg-[#FFB74D] transition-all duration-300 rounded-full max-lg:hidden'
                  style={{
                    width: underlineStyle.width,
                    left: underlineStyle.left,
                  }}
                ></span>
              )}

              {status === 'loading' ? (
                <Skeleton className="w-9 h-9 sm:hidden rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
              ) : status === 'authenticated' ? (
                <div className="relative cursor-pointer select-none sm:hidden">
                  <div className='w-9 h-9 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-full overflow-hidden'>
                    <Image
                      src={session?.user?.avatar?.url || session?.user?.image || assets.userDefaultAvatar}
                      alt="User Avatar"
                      width={50}
                      height={50}
                      className='w-full h-full object-contain'
                    />
                  </div>
                  <span className="xl:w-3 xl:h-3 w-[9px] h-[9px] rounded-full bg-green-500 border-2 border-white dark:border-gray-900 absolute bottom-0.5 right-0.5 shadow-sm dark:shadow-gray-800"></span>
                </div>
              ) : (
                <div>
                  <button onClick={() => router.push('/auth')} className='bg-[var(--primaryColor)] text-white px-4 text-sm text-center py-2 rounded-lg cursor-pointer sm:hidden lg:hover:bg-transparent border border-[var(--primaryColor)] lg:hover:text-[var(--primaryColor)] transition-all duration-300'>
                    Get Started
                  </button>
                </div>
              )}
            </ul>
          </div>

          <div className='flex items-center justify-between sm:gap-6 xl:gap-8 lg:gap-5 max-sm:gap-2'>
            <span onClick={() => setShowInput((prev) => !prev)} className='absolute right-12 text-[var(--primaryColor)] dark:text-[#FFB74D] text-[28px] cursor-pointer sm:hidden'>
              {showInput ? <IoCloseCircle /> : <IoSearch />}
            </span>

            <form onSubmit={handleSearch} className={`flex items-center relative max-sm:hidden`}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder='Search Product'
                className={`text-[var(--textColor)] dark:text-gray-200 dark:bg-gray-800 border border-solid border-[var(--primaryColor)] dark:border-[#FFB74D] py-2 sm:rounded-full rounded-bl-2xl rounded-br-2xl outline-none sm:pl-3 sm:pr-10 lg:pr-10 lg:pl-2 text-sm xl:pr-16 xl:pl-4 dark:placeholder-gray-400`}
              />
              <button
                type="submit"
                className='absolute text-[var(--primaryColor)] dark:text-[#FFB74D] right-4 text-xl lg:text-sm xl:text-2xl sm:text-[var(--textColor)]/40 dark:sm:text-gray-400 cursor-pointer'
              >
                <IoSearch />
              </button>
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className='absolute text-[var(--textColor)]/40 dark:text-gray-400 right-11 text-xl cursor-pointer'
                >
                  <IoCloseCircle />
                </button>
              )}
            </form>

            {showInput && (
              <motion.div
                key="search"
                variants={searchVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`flex sm:hidden items-center relative max-sm:absolute max-sm:right-0 max-sm:top-[60px] ${showInput ? 'max-sm:flex' : 'max-sm:hidden'}`}>
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder='Search Product'
                    className={`text-[var(--textColor)] dark:text-gray-200 dark:bg-gray-800 border border-solid border-[var(--primaryColor)] dark:border-[#FFB74D] py-2 rounded-bl-2xl rounded-br-2xl outline-none max-sm:text-xs pl-5 pr-20 max-sm:bg-white dark:max-sm:bg-gray-800 dark:placeholder-gray-400 w-full transition-colors`}
                  />
                  <button
                    type="submit"
                    className='absolute text-[var(--primaryColor)] dark:text-[#FFB74D] top-1 right-4 text-xl sm:text-[var(--textColor)]/40 dark:sm:text-gray-400 cursor-pointer'
                  >
                    <IoSearch />
                  </button>
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className='absolute text-[var(--textColor)]/40 dark:text-gray-400 right-11 text-xl top-1 cursor-pointer'
                    >
                      <IoCloseCircle />
                    </button>
                  )}
                </form>
              </motion.div>
            )}

            <div onClick={() => router.push('/wishlist')} className='sm:flex items-center relative cursor-pointer hidden'>
              <FaHeart className='text-2xl xl:text-2xl lg:text-xl text-[var(--primaryColor)] dark:text-[#FFB74D]' />
              <span className='bg-[var(--primaryColor)] dark:bg-[#FFB74D] w-4 h-4 rounded-full flex items-center justify-center text-xs text-white absolute -right-2 -top-2'>
                {wishlistItems?.length || 0}
              </span>
            </div>

            <div onClick={() => router.push('/cart')} className='sm:flex items-center relative cursor-pointer hidden'>
              <FaCartShopping className='text-2xl xl:text-2xl lg:text-xl text-[var(--primaryColor)] dark:text-[#FFB74D]' />
              <span className='bg-[var(--primaryColor)] dark:bg-[#FFB74D] w-4 h-4 rounded-full flex items-center justify-center text-xs text-white absolute -right-2 -top-2'>
                {items.length}
              </span>
            </div>

            {status === 'loading' ? (
              <Skeleton className="xl:w-11 xl:h-11 w-9 h-9 max-lg:hidden rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            ) : status === 'authenticated' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative lg:inline-block hidden cursor-pointer select-none">
                    <div className='xl:w-11 xl:h-11 w-9 h-9 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-full overflow-hidden'>
                      <Image
                        src={session?.user?.avatar?.url || session?.user?.image || assets.userDefaultAvatar}
                        alt="User Avatar"
                        width={50}
                        height={50}
                        className='w-full h-full object-contain'
                      />
                    </div>
                    <span className="xl:w-3 xl:h-3 w-[9px] h-[9px] rounded-full bg-green-500 border-2 border-white dark:border-gray-900 absolute bottom-0.5 right-0.5 shadow-sm dark:bg-[#FFB74D]"></span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 absolute top-1 -right-8 text-[var(--textColor)] dark:text-gray-200 dark:bg-gray-900 dark:border-gray-800" >
                  <DropdownMenuLabel className="dark:text-gray-100">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-800" />
                  <DropdownMenuGroup>
                    {session?.user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => router.push('/dashboard/products')} className='cursor-pointer dark:hover:bg-gray-800'>
                        Dashboard
                        <DropdownMenuShortcut><LayoutDashboard className="dark:text-gray-400" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push('/profile')} className='cursor-pointer dark:hover:bg-gray-800'>
                      Profile
                      <DropdownMenuShortcut>
                        <CgProfile className="dark:text-gray-400" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')} className='cursor-pointer dark:hover:bg-gray-800'>
                      Orders
                      <DropdownMenuShortcut><PackageSearch className="dark:text-gray-400" /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/wishlist')} className='cursor-pointer dark:hover:bg-gray-800'>
                      Wishlist / Saved Items
                      <DropdownMenuShortcut><Heart className="dark:text-gray-400" /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="dark:bg-gray-800" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/delivery-addresses')} className='cursor-pointer dark:hover:bg-gray-800'>
                      Delivery Addresses
                      <DropdownMenuShortcut><MapPin className="dark:text-gray-400" /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      setTheme(theme === "dark" ? "light" : "dark");
                    }} className='cursor-pointer dark:hover:bg-gray-800'>
                      Toggle Theme
                      <DropdownMenuShortcut>{theme === "dark" ? <Sun className="dark:text-gray-400" /> : <Moon className="dark:text-gray-400" />}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="dark:bg-gray-800" />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className='cursor-pointer dark:hover:bg-gray-800'>
                    GitHub <DropdownMenuShortcut><FaGithub className="dark:text-gray-400" /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer dark:hover:bg-gray-800'>
                    Support <DropdownMenuShortcut><HelpCircle className="dark:text-gray-400" /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="dark:text-gray-500">API</DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-800" />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className='cursor-pointer dark:hover:bg-gray-800'>
                    Log out
                    <DropdownMenuShortcut><LogOut className="dark:text-gray-400" /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>
                <button onClick={() => router.push('/auth')} className='bg-[var(--primaryColor)] dark:bg-[#FFB74D] text-white xl:px-6 lg:px-4 text-sm text-center py-2 rounded-lg cursor-pointer max-lg:hidden lg:hover:bg-transparent border border-[var(--primaryColor)] dark:border-[#FFB74D] lg:hover:text-[var(--primaryColor)] dark:hover:bg-transparent dark:hover:text-[#FFB74D] transition-all duration-200'>
                  Get Started
                </button>
              </div>
            )}

            <div className='text-[28px] font-semibold text-[var(--primaryColor)] dark:text-[#FFB74D] lg:hidden block cursor-pointer' onClick={() => setOpenMenuBar(true)}>
              <BiMenuAltRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar