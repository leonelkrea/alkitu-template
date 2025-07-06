/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude backend from Next.js compilation
  transpilePackages: [],
  // webpack: (config, { isServer }) => {
  //   // Ignore the alkitu-api directory completely
  //   config.watchOptions = {
  //     ...config.watchOptions,
  //     ignored: ['**/alkitu-api/**', '**/node_modules'],
  //   };

  //   // Add resolve fallback to prevent issues with backend dependencies
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     fs: false,
  //     net: false,
  //     tls: false,
  //   };

  //   return config;
  // },
  // Exclude backend from type checking
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'drive.google.com' },
    ],
  },
  // Configuración para archivos grandes
  // serverExternalPackages: ['googleapis'],
  // Aumentar límites para uploads
  // serverRuntimeConfig: {
  //   maxDuration: 300, // 5 minutes
  // },
};

export default nextConfig;
