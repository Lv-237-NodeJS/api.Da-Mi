
const WebpackStripLoader = require('strip-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const rootPath = __dirname + '/';
const buildPath = __dirname + '/build';
let devConfig = require('./webpack.config.dev.js');

const stripLoader = {
  test: [/\.js$/],
  exclude: /node_modules/,
  use: 'strip-loader',
};

devConfig.module.rules.push(stripLoader);

module.exports = {
  plugins: [
    new CleanWebpackPlugin([buildPath], {
      root: rootPath,
      verbose: true,
      dry: false,
    }),
  ],
};

module.exports = devConfig;
