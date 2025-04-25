/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "people.pic1.co",
      },
      {
        protocol: "https",
        hostname: "app-uploads-cdn.fera.ai",
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer && dev) {
      config.cache = {
        type: 'filesystem',
        compression: false,
        maxAge: 5184000000,
      }
    }
    return config
  }
};

export default nextConfig;
