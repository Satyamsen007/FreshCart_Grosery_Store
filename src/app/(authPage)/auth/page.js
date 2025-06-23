import AuthPage from "@/pages/AuthPage";

export const metadata = {
  title: 'Sign In / Register | FreshCart Account',
  description: 'Sign in to your FreshCart account or create a new one to start shopping. Access your order history, save favorites, and enjoy a personalized shopping experience.',
  keywords: 'sign in, login, register, create account, freshcart account, grocery delivery account',
  openGraph: {
    title: 'Sign In / Register | FreshCart Account',
    description: 'Access your FreshCart account to manage orders, save favorites, and enjoy personalized shopping.',
    url: 'https://freshcart.com/auth',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sign In / Register | FreshCart',
    description: 'Access your FreshCart account to manage your grocery orders and preferences.',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const page = () => {
  return (
    <div>
      <AuthPage />
    </div>
  )
}

export default page;