/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.functionofbeauty.com",
      "www.gravatar.com",
      "images.clerk.dev",
      "curewell-admin-product-images.s3.ap-south-1.amazonaws.com",
      "curewell-admin-patient-images.s3.ap-south-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
