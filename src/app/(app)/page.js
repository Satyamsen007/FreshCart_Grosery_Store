import HomePage from "@/pages/HomePage"

export const metadata = {
  title: 'FreshCart | Fresh Groceries Delivered to Your Doorstep',
  description: 'Shop fresh groceries online at FreshCart. Get farm-fresh produce, dairy, snacks, and more delivered to your home. Enjoy easy online shopping and fast delivery!',
  keywords: 'online grocery, fresh produce, grocery delivery, fresh food, online supermarket',
  openGraph: {
    title: 'FreshCart | Fresh Groceries Delivered to Your Doorstep',
    description: 'Shop fresh groceries online at FreshCart. Get farm-fresh produce, dairy, snacks, and more delivered to your home.',
    url: 'https://freshcart.com',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreshCart | Fresh Groceries Delivered to Your Doorstep',
    description: 'Shop fresh groceries online at FreshCart. Fresh produce, dairy, and more delivered to your door!',
  },
};

const page = () => {
  return (
    <>
      <HomePage />
    </>
  )
}

export default page