/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    "SESSION_SECRET":"2n6!Ql,s;IqA|0|+2AD;Yvu;AIU/I%",
    "BOT_TOKEN":"OTIxNDgyMzc3NTA1NjczMjY3.GmAaLD.5UovnILZWgaGO_5E-nTQT9hGr2HEW7Yplki190"
  },
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
