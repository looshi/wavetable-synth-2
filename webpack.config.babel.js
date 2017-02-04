'use strict';

const webpackValidator = require('webpack-validator');
const resolve = require('path').resolve;
module.exports = function() {
  let config = {
    context: resolve('src'),
    entry: './index.js',
    output: {
      path: resolve('dist'),
      filename: 'bundle.js',
      publicPath: '/dist/',
    },

    // 'eval' Eval will display the babel transpiled code.
    // 'source-map' will display the original source based on the source map.
    devtool: 'source-map',

    module: {
      loaders: [
        {test: /\.js/, loaders: ['babel-loader'], exclude: /node_modules/},
        {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
        {test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
      ],
    },
  };
  return webpackValidator(config);
}
