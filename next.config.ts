/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  allowedDevOrigins: ["localhost:4010", "192.168.100.9:4010"],
};

export default nextConfig;
