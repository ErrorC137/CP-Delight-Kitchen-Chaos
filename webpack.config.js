const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
      favicon: 'src/assets/favicon.png',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/.DS_Store', '**/Thumbs.db']
          }
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
          priority: 10
        }
      }
    }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    }
  }
};
