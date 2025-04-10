const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

// Check if favicon exists to prevent build errors
const faviconPath = path.resolve(__dirname, 'src/assets/favicon.png');
const hasFavicon = fs.existsSync(faviconPath);

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
      ...(hasFavicon && { favicon: faviconPath }), // Only include if favicon exists
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
        'theme-color': '#000000'
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          noErrorOnMissing: true,
          globOptions: {
            ignore: [
              '**/.DS_Store',
              '**/Thumbs.db',
              ...(!hasFavicon ? [] : []) // Additional ignore patterns if needed
            ]
          }
        },
        {
          from: 'docs/404.html',
          to: '404.html'
        },
        {
          from: 'docs/.nojekyll',
          to: '.nojekyll'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js'),
      '@entities': path.resolve(__dirname, 'src/game/entities'),
      '@scenes': path.resolve(__dirname, 'src/game/scenes')
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
          priority: 10,
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 5
        }
      }
    }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  stats: {
    warningsFilter: /favicon/, // Suppress favicon warnings
    children: false // Cleaner output
  }
};
