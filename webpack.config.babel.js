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
  };
  return webpackValidator(config);
}
