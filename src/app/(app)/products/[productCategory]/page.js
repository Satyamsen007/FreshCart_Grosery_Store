import CategoryBasedProductsPage from '@/pages/CategoryBasedProductsPage';

export async function generateMetadata({ params }) {
  const { productCategory } = await params;
  const formattedCategory = productCategory.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `${formattedCategory} | Fresh Groceries | FreshCart`,
    description: `Shop fresh ${formattedCategory.toLowerCase()} at FreshCart. High-quality products, competitive prices, and fast delivery to your doorstep.`,
    keywords: `${formattedCategory.toLowerCase()}, fresh groceries, online shopping, ${formattedCategory.toLowerCase()} delivery`,
    openGraph: {
      title: `${formattedCategory} | Fresh Groceries | FreshCart`,
      description: `Shop the best selection of ${formattedCategory.toLowerCase()} at FreshCart. Fresh, high-quality products delivered to your door.`,
      url: `https://freshcart.com/products/${productCategory}`,
      siteName: 'FreshCart',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedCategory} | FreshCart`,
      description: `Find the best ${formattedCategory.toLowerCase()} at FreshCart. Fresh, high-quality groceries delivered to you.`,
    },
  };
}

const page = async ({ params }) => {
  const { productCategory } = await params;
  return (
    <CategoryBasedProductsPage category={productCategory} />
  )
}

export default page;