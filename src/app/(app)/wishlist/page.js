import React from 'react'
import WishListPage from '@/pages/WishListPage'

export const metadata = {
  title: 'My Wishlist | Save Items for Later | FreshCart',
  description: 'Your FreshCart wishlist. Save your favorite grocery items for later and never forget an item on your shopping list.',
  keywords: 'wishlist, saved items, favorite products, grocery list, save for later',
  openGraph: {
    title: 'My Wishlist | Save Items for Later | FreshCart',
    description: 'Save your favorite grocery items for later and never forget an item on your shopping list.',
    url: 'https://freshcart.com/wishlist',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Wishlist | FreshCart',
    description: 'Save your favorite grocery items for later with FreshCart.',
  },
};

const page = () => {
  return (
    <WishListPage />
  )
}

export default page;