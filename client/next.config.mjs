/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
        pathname: "/dvpweiur3/**",
      },
      {
        protocol: "http", // 👈 add this one too
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dvpweiur3/**",
      },
    ],
  },
};

export default nextConfig;
