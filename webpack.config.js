const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

// Verify assets exist before building
const assetsExist = fs.existsSync(path.resolve(__dirname, 'src/assets'));

module.exports = {
  entry: {
    main: './src/game/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunks/[name].[contenthash].js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|json|mp3|ogg|wav)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[path][name][ext]',
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      }
    }),
    ...(assetsExist ? [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/assets',
            to: 'assets',
            globOptions: {
              ignore: ['**/.DS_Store'],
              dot: true
            }
          }
        ]
      })
    ] : [])
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js')
    }
  },
  optimization: {
    runtimeChunk: 'single',
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
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
