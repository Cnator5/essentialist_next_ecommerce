/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    optimizeRouterScrolling: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;