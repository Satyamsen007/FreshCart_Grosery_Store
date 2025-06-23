'use client'

import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from 'next-themes';

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 max-md:bottom-24">
        <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-md:bottom-24">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {theme === 'dark' ? (
          <FaSun className="w-5 h-5 text-yellow-500" />
        ) : (
          <FaMoon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggler;