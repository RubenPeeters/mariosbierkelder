/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io"
      },
      {
        hostname: "files.oaiusercontent.com"
      }
    ],
  },
};

export default nextConfig;
