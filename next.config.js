/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.functionofbeauty.com", "www.gravatar.com", "images.clerk.dev"],
  },
};

module.exports = nextConfig;
