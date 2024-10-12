/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.google.com",
      },
      {
        hostname: "*.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
