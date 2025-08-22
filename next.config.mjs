/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'avatars.githubusercontent.com'],
  },
  productionBrowserSourceMaps: false,
  // // Production optimizations
  // swcMinify: true,
  // compress: true,
  // poweredByHeader: false,
  // reactStrictMode: true,
  // // Improve production performance
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  // // Enable static optimization where possible
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;
