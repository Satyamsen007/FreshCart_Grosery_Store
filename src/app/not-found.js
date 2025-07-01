import NotFoundPage from "@/pages/NotFoundPage";

export const metadata = {
  title: 'Page Not Found | 404 Error | FreshCart',
  description: 'Oops! The page you\'re looking for doesn\'t exist. Return to the FreshCart homepage or browse our fresh grocery selection.',
  keywords: '404 error, page not found, broken link, freshcart, grocery delivery',
  openGraph: {
    title: 'Page Not Found | 404 Error | FreshCart',
    description: 'Oops! The page you\'re looking for doesn\'t exist. Return to the FreshCart homepage or browse our fresh grocery selection.',
    url: 'https://freshcart.com/404',
    siteName: 'FreshCart',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Page Not Found | FreshCart',
    description: 'Oops! The page you\'re looking for doesn\'t exist. Return to FreshCart.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <NotFoundPage />
  );
}
