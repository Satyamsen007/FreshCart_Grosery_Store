import ContactUsPage from '@/pages/ContactUsPage'

export const metadata = {
  title: 'Contact Us | FreshCart Customer Support',
  description: 'Need help? Contact FreshCart customer support for any questions about your orders, delivery, or our products. We are here to help you with your grocery needs.',
  keywords: 'contact FreshCart, customer support, help center, grocery delivery support, contact customer service',
  openGraph: {
    title: 'Contact Us | FreshCart Customer Support',
    description: 'Need help? Contact FreshCart customer support for any questions about your orders, delivery, or our products.',
    url: 'https://freshcart.com/contact-us',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | FreshCart Customer Support',
    description: 'Have questions? Our customer support team is here to help with your FreshCart experience.',
  },
};

const page = () => {
  return (
    <ContactUsPage />
  )
}

export default page;