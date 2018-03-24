/**
 * Transpiles create-react-library CLI to ES5 in order to support node >= 4.
 *
 * Note: we use Webpack to compile the CLI, but the generated template still
 * uses Rollup for compiling the library. We don't judge between the two, but
 * rather try to use the best tool for the job.
 */

'use strict'

const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
    process: false
  },
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  externals: [
    nodeExternals()
  ],
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true
    })
  ],
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'shebang-loader'
          },
          {
            loader: 'babel-loader',
            query: {
              babelrc: false,
              plugins: [
                'transform-async-to-generator',
                'transform-runtime'
              ],
              presets: [
                'env',
                'stage-0'
              ]
            }
          }
        ]
      }
    ]
  }
}
