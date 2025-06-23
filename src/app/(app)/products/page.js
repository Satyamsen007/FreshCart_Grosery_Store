import AllProductsPage from "@/pages/AllProductsPage";


export const metadata = {
  title: 'All Products | FreshCart Online Grocery Store',
  description: 'Browse our wide selection of fresh groceries, including fruits, vegetables, dairy, and pantry staples. Quality products at competitive prices with fast delivery.',
  keywords: 'grocery products, online shopping, fresh food, pantry items, dairy products',
  openGraph: {
    title: 'All Products | FreshCart Online Grocery Store',
    description: 'Browse our wide selection of fresh groceries, including fruits, vegetables, dairy, and pantry staples.',
    url: 'https://freshcart.com/products',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Products | FreshCart Online Grocery Store',
    description: 'Discover quality groceries at FreshCart. Fresh produce, dairy, and pantry essentials delivered to your door!',
  },
};

const Page = () => {
  return (
    <AllProductsPage />
  )
}

export default Page;
