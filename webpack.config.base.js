/* eslint strict: 0 */
'use strict';

const path = require('path');
// const BowerWebpackPlugin = require("bower-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    },{
      include: /\.json$/, 
      loaders: ["json-loader"]
    },{
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }
   ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [
    // new BowerWebpackPlugin(),
    // new webpack.ProvidePlugin({
    //   $:      "jquery",
    //   jQuery: "jquery"
    // })
      new webpack.IgnorePlugin(/vertx/),
      // new webpack.IgnorePlugin(/electroknit/)
    ],
  externals: [
    'electroknit'
    // put your node 3rd party libraries which can't be built with webpack here (mysql, mongodb, and so on..)
  ]
};