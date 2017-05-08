// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

module.exports = {
  entry: {
    app: resolve('./app.js')
  },
  devtool: 'source-maps',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'buble-loader',
      include: [resolve('.')],
      exclude: [/node_modules/],
      options: {
        objectAssign: 'Object.assign'
      }
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
