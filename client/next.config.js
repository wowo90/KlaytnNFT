/** @type {import('next').NextConfig} */
/*
const nextConfig = {
  reactStrictMode: true,
  
}

module.exports = nextConfig
*/

module.exports = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      crypto: false,
      fs: false,
      path: false,
      http: false,
      https: false,
      stream: false,
      constants: false,
      path: false,
      tty: false,
      zlib: false,
    };

    return config;
  },
};
