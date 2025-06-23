import ProfilePage from '@/pages/ProfilePage'

export const metadata = {
  title: 'My Account | FreshCart Profile',
  description: 'Manage your FreshCart account details, view order history, update delivery addresses, and track your current orders in one convenient place.',
  keywords: 'my account, profile settings, order history, delivery addresses, account preferences',
  openGraph: {
    title: 'My Account | FreshCart Profile',
    description: 'Manage your FreshCart account details, view order history, and update your preferences.',
    url: 'https://freshcart.com/profile',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Account | FreshCart Profile',
    description: 'Manage your FreshCart account and track your grocery orders.',
  },
};

const page = () => {
  return (
    <ProfilePage />
  )
}

export default page