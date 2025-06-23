'use client'

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { assets } from '../../../../public/assets/assets';
import { Skeleton } from '@/components/ui/skeleton';
import { BiMenuAltRight } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { setOpenSideMenu } from '@/store/features/appSlice';
import { usePathname } from 'next/navigation';

const DashboardTopNavbar = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const pathname = usePathname();
  return (
    <header className="w-full h-[10vh] bg-white dark:bg-gray-900 flex items-center justify-between px-6 max-md:px-2 shadow-[0_1px_0px_1px_rgba(79,191,139,0.3)] dark:shadow-[0_1px_0px_1px_rgba(255,183,77,0.3)]">
      <div className='max-md:flex max-md:items-center max-md:gap-4'>
        <div onClick={() => dispatch(setOpenSideMenu(true))} className='text-[28px] font-semibold text-[var(--primaryColor)] dark:text-[#FFB74D] md:hidden block cursor-pointer'>
          <BiMenuAltRight />
        </div>
        {/* Left side - Page title */}
        <h1 className="text-xl font-semibold text-[var(--textColor)] dark:text-white">{pathname === '/dashboard' && 'Dashboard' || pathname === '/dashboard/products' && 'Products' || pathname === '/dashboard/customers' && 'Customers' || pathname === '/dashboard/orders' && 'Orders' || pathname === '/dashboard/sales' && 'Sales' || pathname === '/dashboard/shipping' && 'Shipping' || pathname === '/dashboard/returns' && 'Returns'}</h1>
      </div>

      {/* Right side - Greeting & Avatar */}
      <div className="flex items-center gap-5">
        <span className="text-[var(--textColor)] dark:text-gray-200 text-sm">Hi! Admin</span>

        {
          status === 'loading' ? (
            <Skeleton className="xl:w-13 xl:h-13 w-9 h-9 rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
          ) : (
            <div className="relative cursor-pointer select-none">
              <div className='xl:w-13 xl:h-13 w-9 h-9 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-full overflow-hidden'>
                <Image
                  src={session?.user?.avatar?.url || session?.user?.image || assets.userDefaultAvatar}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className='w-full h-full object-contain'
                />
              </div>
              <span className="xl:w-3 xl:h-3 w-[9px] h-[9px] rounded-full bg-green-500 border-2 border-white dark:border-gray-900 dark:bg-[#FFB74D] absolute bottom-0.5 right-1"></span>
            </div>
          )
        }

      </div>
    </header>
  )
}

export default DashboardTopNavbar