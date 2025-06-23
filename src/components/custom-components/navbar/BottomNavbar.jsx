'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Heart, LayoutDashboard, PackageSearch, ShoppingCart, MapPin, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';
import useScrollingEffect from '@/hooks/use-scroll';
import useNavigation from '@/hooks/use-navigation';
import { FaCartShopping } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
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
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { assets } from '../../../../public/assets/assets';

const BottomNav = () => {
  const scrollDirection = useScrollingEffect();
  const navClass = scrollDirection === 'up' ? '' : 'duration-500';
  const { data: session, status } = useSession()
  const { setTheme, theme } = useTheme()
  const router = useRouter();
  const {
    isHomeActive,
    isWishlistActive,
    isCartActive,
  } = useNavigation();

  const { items } = useSelector(state => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const activeClass = 'bg-white dark:bg-gray-800 text-[var(--primaryColor)] dark:text-[#FFB74D] rounded-full p-2';
  return (
    <div
      className={`fixed bottom-0 left-0 w-full py-4 rounded-tr-2xl rounded-tl-2xl z-[1000] bg-[var(--primaryColor)] dark:bg-gray-900 border-t border-zinc-200 dark:border-gray-700 shadow-lg sm:hidden ${navClass}`}
    >
      <div className="flex justify-around items-center w-full bg-transparent text-white dark:text-gray-200">
        {
          status === 'loading' ? (
            <Skeleton className="w-11 h-11 sm:hidden rounded-full bg-white/50 dark:bg-gray-700" />
          ) : (
            <Link href="/" className={`relative flex items-center ${isHomeActive ? activeClass : 'text-white dark:text-gray-200'}`}>
              <Home
                width="25"
                height="25"
                className={isHomeActive ? '' : 'dark:text-gray-200'}
              />
            </Link>
          )
        }

        {
          status === 'loading' ? (
            <Skeleton className="w-11 h-11 sm:hidden rounded-full bg-white/50 dark:bg-gray-700" />
          ) : (
            <Link href="/wishlist" className={`flex relative items-center ${isWishlistActive ? activeClass : 'text-white dark:text-gray-200'}`}>
              <Heart
                width="25"
                height="25"
                className={isWishlistActive ? '' : 'dark:text-gray-200'}
              />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 dark:bg-[#FFB74D] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow-sm dark:shadow-gray-800">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          )
        }

        {
          status === 'loading' ? (
            <Skeleton className="w-11 h-11 sm:hidden rounded-full bg-white/50 dark:bg-gray-700" />
          ) : (
            <Link href="/cart" className={`flex items-center relative text-[25px] ${isCartActive ? activeClass : 'text-white dark:text-gray-200'}`}>
              <FaCartShopping className={isCartActive ? '' : 'dark:text-gray-200'} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 dark:bg-[#FFB74D] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow-sm dark:shadow-gray-800">
                  {items.length}
                </span>
              )}
            </Link>
          )
        }

        {
          status === 'loading' ? (
            <Skeleton className="w-11 h-11 sm:hidden rounded-full bg-white/50 dark:bg-gray-700" />
          ) : status === 'authenticated' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer select-none sm:hidden">
                  <div className='w-11 h-11 border-2 border-white dark:border-[#FFB74D] rounded-full overflow-hidden'>
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
              <DropdownMenuContent side='top' align='center' className="w-64 z-[1000] text-[var(--textColor)] dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700" >
                <DropdownMenuLabel className="dark:text-gray-100">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuGroup>
                  {session?.user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => router.push('/dashboard/products')} className='cursor-pointer dark:hover:bg-gray-700'>
                      Dashboard
                      <DropdownMenuShortcut><LayoutDashboard className="dark:text-gray-400" /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/profile')} className='cursor-pointer dark:hover:bg-gray-700'>
                    Profile
                    <DropdownMenuShortcut>
                      <CgProfile className="dark:text-gray-400" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/orders')} className='cursor-pointer dark:hover:bg-gray-700'>
                    Orders
                    <DropdownMenuShortcut><PackageSearch className="dark:text-gray-400" /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/wishlist')} className='cursor-pointer dark:hover:bg-gray-700'>
                    Wishlist / Saved Items
                    <DropdownMenuShortcut><Heart className="dark:text-gray-400" /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/delivery-addresses')} className='cursor-pointer dark:hover:bg-gray-700'>
                    Delivery Addresses
                    <DropdownMenuShortcut><MapPin className="dark:text-gray-400" /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setTheme(theme === "dark" ? "light" : "dark");
                  }} className='cursor-pointer dark:hover:bg-gray-700'>
                    Toggle Theme
                    <DropdownMenuShortcut>{theme === "dark" ? <Sun className="dark:text-gray-400" /> : <Moon className="dark:text-gray-400" />}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem onClick={() => router.push('/dashboard')} className='cursor-pointer dark:hover:bg-gray-700'>
                  GitHub <DropdownMenuShortcut><FaGithub className="dark:text-gray-400" /></DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer dark:hover:bg-gray-700'>
                  Support <DropdownMenuShortcut><HelpCircle className="dark:text-gray-400" /></DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="dark:text-gray-500">API</DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className='cursor-pointer dark:hover:bg-gray-700'>
                  Log out
                  <DropdownMenuShortcut><LogOut className="dark:text-gray-400" /></DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href='/auth' className="flex items-center text-[25px] text-white dark:text-gray-200">
              <CgProfile />
            </Link>
          )
        }
      </div>
    </div>
  );
};

export default BottomNav;
