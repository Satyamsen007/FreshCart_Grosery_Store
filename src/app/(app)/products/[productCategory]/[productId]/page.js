import ProductDetailsPage from '@/pages/ProductDetailsPage';

export async function generateMetadata({ params }) {
  const { productCategory } = await params;
  
  const formattedCategory = productCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    title: `Product Details | ${formattedCategory} | FreshCart`,
    description: `View details for this product in our ${formattedCategory} collection.`,
  };
}

const page = async ({ params }) => {
  const { productCategory, productId } = await params;
  return (
    <ProductDetailsPage productCategory={productCategory} productId={productId} />
  )
}

export default page;