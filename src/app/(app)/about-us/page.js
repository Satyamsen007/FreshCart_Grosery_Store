import AboutUsPage from '@/pages/AboutUsPage';

export const metadata = {
  title: 'About FreshCart | Fresh Groceries, Delivered',
  description: 'Discover the story behind FreshCart. We deliver farm-fresh groceries to your door with convenience and care. Learn about our commitment to quality and community.',
  keywords: 'about FreshCart, our story, grocery delivery, fresh produce, our mission',
  openGraph: {
    title: 'About FreshCart | Fresh Groceries, Delivered',
    description: 'Discover the story behind FreshCart. We deliver farm-fresh groceries to your door with convenience and care.',
    url: 'https://freshcart.com/about-us',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FreshCart | Fresh Groceries, Delivered',
    description: 'Learn about our commitment to bringing fresh, quality groceries to your doorstep with care and convenience.',
  },
};

const AboutPage = () => {
  return (
    <AboutUsPage />
  )
}

export default AboutPage;