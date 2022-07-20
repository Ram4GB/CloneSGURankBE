const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: {
    index: './src/index.ts',
  },
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [],
  resolve: {
    fallback: {},
    alias: {

    },
    extensions: ['.js', '.ts'],
  },
  devtool: process.env.NODE_ENV === 'development' ? "source-map" : "eval",
  stats: 'errors-warnings',
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
}