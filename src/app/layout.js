import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import ReduxProvider from "@/context/ReduxProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggler from "@/components/custom-components/ThemeToggler";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "FreshCart – Your Online Grocery Store for Freshness & Savings!",
  description: "Shop smart and eat fresh with FreshCart—your trusted online grocery store. Discover a wide range of farm-fresh produce, pantry staples, dairy, snacks, and more—all delivered to your door. Save time, enjoy great deals, and make every meal healthier with FreshCart!",
  icons: {
    icon: [
      { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/favicons/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/favicons/android-chrome-512x512.png' },

      { rel: "icon", type: "image/ico", url: "/favicons/favicon.ico", },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicons/favicon-16x16.png", },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicons/favicon-32x32.png", },
    ],
    apple: '/favicons/apple-touch-icon.png',
  },
  manifest: '/favicons/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${poppins.className} font-poppins dark:bg-gray-900`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              {children}
              <ThemeToggler />
              <Toaster />
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
