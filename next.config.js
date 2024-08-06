// const path = require('path');

// module.exports = {
//   reactStrictMode: true,
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.(png|jpe?g|gif|svg|ico)$/i,
//       use: [
//         {
//           loader: 'file-loader',
//           options: {
//             publicPath: '/_next/static/images',
//             outputPath: 'static/images',
//             name: '[name].[hash].[ext]',
//           },
//         },
//       ],
//     });

//     return config;
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/uploads/:path*',
//         destination: '/_next/static/images/:path*',
//       },
//     ];
//   },
// };

const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack(config) {
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

