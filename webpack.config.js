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
    // change this to './dist/' for production build, '/dist/' for local host.
    publicPath: ''
  },
  devServer: {
    // static: {
    //   directory: path.join(__dirname, 'dist'),
    // },
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
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./index.html", to: "./index.html" },
        { from: "./src/data/WaveTableData.json", to: "./data/WaveTableData.json" },
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
/*
const resolve = require('path').resolve
module.exports = function () {
  let config = {
    context: resolve('src'),
    entry: './index.js',
    output: {
      path: resolve('dist'),
      filename: 'bundle.js',
      // change this to './dist/' for production build, '/dist/' for local host.
      publicPath: './dist/'
    },

    // 'eval' Eval will display the babel transpiled code.
    // 'source-map' will display the original source based on the source map.
    devtool: 'source-map',

    module: {
      loaders: [
        { test: /\.js/, loaders: ['babel-loader'], exclude: /node_modules/ },
        { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
        { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
        { test: /\.png/, loaders: ['file-loader'] },
        { test: /\.json/, loaders: ['file-loader'] },
        { test: /\.worker\.js$/, loaders: ['worker-loader', 'babel-loader'] }
      ]
    }
  }
  return config
}
*/
