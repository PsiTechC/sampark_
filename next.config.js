const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|ico)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/uploads',
            outputPath: 'static/uploads',
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });

    // Add fallbacks for Node.js core modules
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/_next/static/uploads/:path*',
      },
    ];
  },
};
