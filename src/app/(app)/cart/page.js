import CartPage from '@/pages/CartPage';

export const metadata = {
  title: 'Your Shopping Cart | FreshCart',
  description: 'Review items in your FreshCart. Ready to check out? Complete your grocery order with our secure checkout process and enjoy fast delivery.',
  keywords: 'shopping cart, grocery cart, online cart, checkout, fresh groceries',
  openGraph: {
    title: 'Your Shopping Cart | FreshCart',
    description: 'Review items in your FreshCart. Complete your grocery order with our secure checkout process.',
    url: 'https://freshcart.com/cart',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Shopping Cart | FreshCart',
    description: 'Review and manage your grocery items before checkout. Fresh groceries delivered to your door!',
  },
};

const page = () => {
  return (
    <CartPage />
  )
}

export default page