'use strict'

const webpackValidator = require('webpack-validator')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const resolve = require('path').resolve
module.exports = function () {
  let config = {
    context: resolve('src'),
    entry: './index.js',
    output: {
      path: resolve('dist'),
      filename: 'bundle.js',
      publicPath: './dist/'
    },

    // 'eval' Eval will display the babel transpiled code.
    // 'source-map' will display the original source based on the source map.
    devtool: 'source-map',

    module: {
      loaders: [
        {test: /\.js/, loaders: ['babel-loader'], exclude: /node_modules/},
        {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
        // {test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true
                }
              },
              'sass-loader'
            ]
          })
        },
        {test: /\.png/, loaders: ['file-loader']},
        {test: /\.json/, loaders: ['file-loader']},
        {test: /\.worker\.js$/, loaders: ['worker-loader', 'babel-loader']}
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ]
  }
  return config
}
