/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildError: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
