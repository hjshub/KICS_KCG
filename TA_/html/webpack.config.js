const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode,
  // entry: './src/assets/js/common.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    environment: {
      arrowFunction: false, // <-- this line does the trick
    },
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/ui.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: {
        //   and: [/node_modules/], // Exclude libraries in node_modules ...
        //   not: [
        //     // Except for a few of them that needs to be transpiled because they use modern syntax
        //     /jquery/,
        //     /gsap/,
        //     /swiper/,
        //   ],
        // },
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
