const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/game/main.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js',
    publicPath: '' // Ensures asset paths are resolved correctly
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|json)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]' // Organizes assets in docs/assets
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      // Phaser modules alias for better bundling
      'phaser': path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js')
    }
  },
  plugins: [
    // Fixes Phaser's window reference
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof EXPERIMENTAL': JSON.stringify(false),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false)
    })
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        phaser: {
          test: /[\\/]node_modules[\\/]phaser[\\/]/,
          name: 'phaser',
          chunks: 'all',
          priority: 10
        }
      }
    }
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
