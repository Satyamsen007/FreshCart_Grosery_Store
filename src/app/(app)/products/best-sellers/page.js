import BestSellersPage from '@/pages/BestSellersPage';

export const metadata = {
  title: 'Best Sellers | Top-Rated Groceries | FreshCart',
  description: 'Shop our best-selling grocery items. Discover the most popular and highly-rated products that our customers love. Fresh, high-quality groceries delivered to your door.',
  keywords: 'best selling groceries, popular products, top-rated items, customer favorites, best deals on groceries',
  openGraph: {
    title: 'Best Sellers | Top-Rated Groceries | FreshCart',
    description: 'Discover our most popular grocery items that customers love. Shop best-sellers with confidence.',
    url: 'https://freshcart.com/products/best-sellers',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Sellers | FreshCart',
    description: 'Shop our most popular grocery items that customers love. Fresh, high-quality products delivered.',
  },
  alternates: {
    canonical: 'https://freshcart.com/products/best-sellers',
  },
};

const page = () => {
  return (
    <BestSellersPage />
  )
}

export default page;