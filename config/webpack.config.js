const CopyWebpackPlugin = require('copy-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
const path = require('path');
const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';

module.exports = {
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: '[name].js'
  },
  entry: {
    'background': path.resolve(__dirname, '..', 'src', 'background_scripts', 'entry.js'),
  },
  mode: production ? 'production' : 'development',
  devtool: production ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '..', 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            'presets': [
              ['env', {
                'targets': {
                  'firefox': 57
                }
              }]
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json'
      },
      {
        from: 'LICENSE.md'
      },
      {
        from: 'src/icons/*.svg',
        to: 'icons/',
        flatten: true
      }
    ]),
    new LicenseWebpackPlugin(
      {
        pattern: /.*/,
        outputFilename: '[name].license.txt'
      }
    )
  ]
};
