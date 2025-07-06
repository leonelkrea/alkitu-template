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
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value:
              'https://www.insidehair.es, https://insidehair.es, http://www.insidehair.es, http://insidehair.es',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
