'use client'

import { DollarSign, Package, ShoppingCart, Truck, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../../../../public/assets/assets';
import Image from 'next/image';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { IoCloseCircleOutline } from "react-icons/io5";
import { setOpenSideMenu } from '@/store/features/appSlice';


const DashboardSideMenuBar = () => {
  const navItems = [
    { name: "Products", icon: <Package />, path: "/dashboard/products" },
    { name: "Customers", icon: <Users />, path: "/dashboard/customers" },
    { name: "Orders", icon: <ShoppingCart />, path: "/dashboard/orders" },
    { name: "Sales", icon: <DollarSign />, path: "/dashboard/sales" },
    { name: "Shipping", icon: <Truck />, path: "/dashboard/shipping" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [collapsSideMenu, setCollapsSideMenu] = useState(false);
  const navRefs = useRef([]);
  const menuRoutes = ['/dashboard/products', '/dashboard/customers', '/dashboard/orders', '/dashboard/sales', '/dashboard/shipping',];

  const router = useRouter();
  const { data: session, status } = useSession()
  const pathname = usePathname();
  const openSideMenu = useSelector((state) => state.app.openSideMenu);
  const dispatch = useDispatch()
  useEffect(() => {
    const updateUnderline = () => {
      const currentEl = navRefs.current[activeIndex];
      if (currentEl) {
        setUnderlineStyle({
          top: currentEl.offsetTop,
          height: currentEl.offsetHeight,
        });
      }
    };

    updateUnderline(); // Initial position

    window.addEventListener('resize', updateUnderline); // On resize
    return () => window.removeEventListener('resize', updateUnderline); // Cleanup
  }, [activeIndex, session]);

  useEffect(() => {
    const index = menuRoutes.findIndex(route => pathname === route);
    if (index !== -1) {
      setActiveIndex(index);
      dispatch(setOpenSideMenu(false))
    } else {
      setActiveIndex(null);
    }
  }, [pathname]);
  return (
    <aside className={`h-screen overflow-y-auto srollbar-hidden ${collapsSideMenu ? 'w-[120px] gap-3' : 'xl:w-[300px] md:w-[180px] justify-between max-md:w-[80%]'} bg-white dark:bg-gray-900 z-50 flex flex-col shadow-[1px_0_0px_1px_rgba(79,191,139,0.3)] dark:shadow-[1px_0_0px_1px_rgba(255,183,77,0.3)] max-md:absolute transition-all duration-300 ease-in-out ${openSideMenu ? 'max-md:left-0' : 'max-md:-left-full'}`}>
      {/* Top */}
      <div>
        <div className={`flex items-center ${collapsSideMenu ? 'flex-col pt-5' : 'justify-between p-4 gap-3'}`}>
          <div onClick={() => router.push('/')} className={`cursor-pointer ${collapsSideMenu ? 'w-[100px]' : 'w-[120px]'}`}>
            <Image
              src={assets.Logo}
              alt="Page Logo"
              sizes="(max-width: 768px) 120px, (max-width: 1024px) 130px, 140px"
              className="w-full h-full object-contain dark:invert"
            />
          </div>
          <div onClick={() => dispatch(setOpenSideMenu(false))} className='text-2xl cursor-pointer md:hidden text-[var(--primaryColor)] dark:text-[#FFB74D]'>
            <IoCloseCircleOutline />
          </div>
          <div onClick={() => setCollapsSideMenu(prev => !prev)} className='text-2xl text-[var(--primaryColor)] dark:text-[#FFB74D] cursor-pointer max-md:hidden'>
            <MdKeyboardArrowLeft className={`${collapsSideMenu ? 'rotate-180' : ''} transition-transform`} />
          </div>
        </div>

        {!collapsSideMenu && (<h2 className='text-lg text-[var(--textColor)] dark:text-white mt-3 pl-4'>Main Menu</h2>)}

        <nav className={`mt-6 relative ${collapsSideMenu ? 'pr-3' : 'xl:pr-7'}`}>
          <ul className={`space-y-5 px-3 ${collapsSideMenu ? 'flex flex-col items-center xl:px-7' : 'xl:pr-7'} `}>
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;

              return (
                <li key={item.name}
                  ref={(el) => (navRefs.current[index] = el)}
                  onClick={() => {
                    router.push(menuRoutes[index]);
                  }}
                >
                  <button
                    className={`flex items-center w-full md:flex-col xl:flex-row gap-3 px-4 py-2 rounded-md font-medium border border-[var(--primaryColor)] dark:border-[#FFB74D] text-sm ${!isActive && 'hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D]'} cursor-pointer transition 
                      ${isActive ? "bg-[var(--primaryColor)] dark:bg-[#FFB74D] text-white" : "text-[var(--textColor)] dark:text-gray-200"} ${collapsSideMenu ? 'justify-center px-2' : ''}`}
                  >
                    {item.icon}
                    {!collapsSideMenu && item.name}
                  </button>
                </li>
              );
            })}

            {/* Underline animation (desktop only) */}
            {activeIndex !== null && !collapsSideMenu && (
              <span
                className='absolute right-0 xl:w-3 rounded-tl-full rounded-bl-full bg-[var(--primaryColor)] dark:bg-[#FFB74D] transition-all duration-300 ease-in-out md:w-2'
                style={{
                  height: underlineStyle.height,
                  top: underlineStyle.top,
                }}
              ></span>
            )}
          </ul>
        </nav>
      </div>

      {/* Bottom User Section */}
      {!collapsSideMenu && (
        <div className="p-4 border-t dark:border-gray-700">
          <div className={`flex items-center gap-3 ${collapsSideMenu ? 'flex-col' : ''}`}>
            {status === 'loading' ? (
              <Skeleton className="xl:w-11 xl:h-11 w-9 h-9 max-lg:hidden rounded-full bg-[var(--primaryColor)]/50 dark:bg-gray-700" />
            ) : (
              <div className='xl:w-11 xl:h-11 w-9 h-9 border-2 border-[var(--primaryColor)] dark:border-[#FFB74D] rounded-full overflow-hidden'>
                <Image
                  src={session?.user?.avatar?.url || session?.user?.image || assets.userDefaultAvatar}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-[var(--textColor)] dark:text-white">{session?.user?.fullName}</p>
              <p className="text-xs text-green-600 dark:text-[#FFB74D]">Super Admin</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default DashboardSideMenuBar