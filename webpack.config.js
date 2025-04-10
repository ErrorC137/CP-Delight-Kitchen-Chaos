const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Explicitly name the entry point
  entry: {
    main: './src/game/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'docs'),
    // Use [name] placeholder to generate unique filenames
    filename: '[name].bundle.js',
    // Organize additional chunks in a subfolder
    chunkFilename: 'chunks/[name].bundle.js',
    // Use relative path for GitHub Pages compatibility
    publicPath: './'
  },

  module: {
    rules: [
      // Transpile JavaScript using Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      // Process images, JSON, and other assets
      {
        test: /\.(png|jpe?g|gif|svg|json)$/,
        type: 'asset/resource',
        generator: {
          // Place assets in the "docs/assets" folder
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      // Ensure Phaser resolves correctly (using Phaser's built file)
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js')
    }
  },

  plugins: [
    // Automatically generate an index.html file with injected script tags
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],

  devServer: {
    static: path.join(__dirname, 'docs'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    historyApiFallback: true
  },

  optimization: {
    // Extract Webpack runtime into its own file
    runtimeChunk: 'single',
    // Configure code splitting for vendor libraries
    splitChunks: {
      cacheGroups: {
        phaser: {
          test: /[\\/]node_modules[\\/]phaser[\\/]/,
          name: 'phaser',
          chunks: 'all',
          enforce: true,
          priority: 10
        }
      }
    },
    minimize: true
  },

  performance: {
    // Set performance limits to avoid warnings
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
