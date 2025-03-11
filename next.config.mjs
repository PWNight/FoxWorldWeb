/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Разрешает все домены для HTTPS
      },
      {
        protocol: "http", // Опционально, если нужны HTTP-сайты
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
