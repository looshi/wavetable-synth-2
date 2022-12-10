const path = require('path');
const webpack = require('webpack');
const resolve = require('path').resolve;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: './src/index.js',
  output: {
    path: resolve('dist'),
    filename: 'bundle.js',
    publicPath: ''
  },
  devServer: {
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: [
          'worker-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./index.html", to: "./index.html" },
        { from: "./src/data/WaveTableData.json", to: "./data/WaveTableData.json" },
        { from: "./images", to: "./images" }
      ],
    }),
  ],
  resolve: {
    modules: [
      'node_modules',
      'src'
    ]
  }
};
