/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents:true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Changed this to allow all paths
      },
      {
        protocol: "http", // 👈 add this one too
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Changed this to allow all paths
      },
      {
        protocol: 'https',
        hostname: 'd2ati23fc66y9j.cloudfront.net', // Corrected from .js to .net
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
