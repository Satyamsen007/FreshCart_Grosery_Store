import OrdersPage from '@/pages/OrdersPage';

export const metadata = {
  title: 'My Orders | Order History | FreshCart',
  description: 'View your FreshCart order history, track current orders, and manage your past purchases. Check order status, delivery updates, and reorder your favorite items.',
  keywords: 'order history, track order, past orders, order status, delivery updates, reorder',
  openGraph: {
    title: 'My Orders | Order History | FreshCart',
    description: 'Track your FreshCart orders and view your complete order history in one place.',
    url: 'https://freshcart.com/orders',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Orders | FreshCart',
    description: 'Track and manage your FreshCart grocery orders.',
  },
};

const page = () => {
  return (
    <OrdersPage />
  )
}

export default page