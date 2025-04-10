const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Use a string entry so that the main bundle is named based on our output.filename.
  entry: './src/game/main.js',

  output: {
    // Output directory for GitHub Pages
    path: path.resolve(__dirname, 'docs'),
    // Force the main bundle to be "bundle.js"
    filename: 'bundle.js',
    // Any additional chunks will be emitted into the "chunks" folder with unique names
    chunkFilename: 'chunks/[name].bundle.js',
    // Use a relative public path so assets load correctly on GitHub Pages
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
      template: 'src/index.html', // Our HTML template file
      filename: 'index.html',       // Will be placed in the "docs" folder
      inject: 'body'                // Scripts will be injected at the end of the <body>
    })
  ],

  devServer: {
    // Local development server configuration
    static: path.join(__dirname, 'docs'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    historyApiFallback: true
  },

  optimization: {
    // Extract Webpack runtime into its own file (e.g., runtime.bundle.js)
    runtimeChunk: 'single',
    // Configure code splitting for vendor libraries such as Phaser
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
