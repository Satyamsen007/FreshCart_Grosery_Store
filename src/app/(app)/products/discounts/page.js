import DiscountProductsPage from "@/pages/DiscountProductsPage";

export const metadata = {
  title: 'Discounted Groceries | Special Offers | FreshCart',
  description: 'Save big on your grocery shopping with our discounted items. Limited-time offers and special deals on fresh produce, pantry staples, and more. Shop now for the best prices!',
  keywords: 'discounted groceries, special offers, sale items, grocery deals, limited time offers, clearance items',
  openGraph: {
    title: 'Discounted Groceries | Special Offers | FreshCart',
    description: 'Find amazing deals on quality groceries. Limited-time discounts on fresh produce, pantry staples, and more.',
    url: 'https://freshcart.com/products/discounts',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discounted Groceries | FreshCart',
    description: 'Shop our selection of discounted grocery items. Limited-time offers on fresh, high-quality products.',
  },
  alternates: {
    canonical: 'https://freshcart.com/products/discounts',
  },
};

const page = () => {
  return (
    <DiscountProductsPage />
  )
}

export default page;