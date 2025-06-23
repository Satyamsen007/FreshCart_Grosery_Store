import CheckOutPage from '@/pages/CheckOutPage';

export const metadata = {
  title: 'Secure Checkout | FreshCart Grocery Delivery',
  description: 'Complete your grocery order with our secure checkout. Multiple payment options available. Fast, fresh delivery to your doorstep!',
  keywords: 'checkout, secure payment, grocery delivery, online payment, order confirmation',
  openGraph: {
    title: 'Secure Checkout | FreshCart Grocery Delivery',
    description: 'Complete your grocery order with our secure checkout. Multiple payment options available.',
    url: 'https://freshcart.com/checkout',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secure Checkout | FreshCart Grocery Delivery',
    description: 'Complete your grocery order with our secure checkout. Fast, fresh delivery to your door!',
  },
};

const page = () => {
  return (
    <CheckOutPage />
  )
}

export default page