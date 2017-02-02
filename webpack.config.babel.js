'use strict';

const webpackValidator = require('webpack-validator');
const resolve = require('path').resolve;
module.exports = function() {
  let config = {
    context: resolve('src'),
    entry: './bootstrap.js',
    output: {
      path: resolve('dist'),
      filename: 'bundle.js',
      publicPath: '/dist/',
    },
    devtool: 'source-map', // 'eval' // None of these options work.
    module: {
      loaders: [
        {test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/},
        {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
      ],
    },
  };
  return webpackValidator(config);
}
