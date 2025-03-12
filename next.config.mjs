/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", 'http://3.7.45.143/', 'http://3.7.45.143:8000/', 'http://3.7.45.143', '3.7.45.143'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: "",
      },
    ],
  },
};

export default nextConfig;
