'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const useNavigation = () => {
  const pathname = usePathname();

  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCartActive, setIsCartActive] = useState(false);

  useEffect(() => {
    // Reset all first
    setIsHomeActive(false);
    setIsWishlistActive(false);
    setIsCartActive(false);

    // Set the correct one to true
    if (pathname === '/') setIsHomeActive(true);
    else if (pathname === '/wishlist') setIsWishlistActive(true);
    else if (pathname === '/cart') setIsCartActive(true);
  }, [pathname]);

  return {
    isHomeActive,
    isCartActive,
    isWishlistActive,
  };
};

export default useNavigation;
