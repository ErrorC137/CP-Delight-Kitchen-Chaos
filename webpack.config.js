const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point for the application
  entry: './src/game/main.js',

  // Output configuration for GitHub Pages
  output: {
    // Output directory for the production build (GitHub Pages serves from "docs")
    path: path.resolve(__dirname, 'docs'),
    // Filename for the main bundle
    filename: 'bundle.js',
    // Filename pattern for additional (split) chunks
    chunkFilename: '[name].bundle.js',
    // Set relative public path for GitHub Pages
    publicPath: './'
  },

  module: {
    rules: [
      // Transpile ES6+ JavaScript using Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      // Process image, JSON, and other asset files
      {
        test: /\.(png|jpe?g|gif|svg|json)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]' // Place assets in the "docs/assets" folder
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      // Ensure Phaser resolves correctly (using the full build)
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js')
    }
  },

  plugins: [
    // Generate index.html in the output directory with the bundle injected
    new HtmlWebpackPlugin({
      template: 'src/index.html', // Your HTML template file
      filename: 'index.html',     // Output file in the "docs" folder
      inject: 'body'              // Inject <script> at the end of the <body>
    })
  ],

  // Development server configuration (useful during local development)
  devServer: {
    static: path.join(__dirname, 'docs'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    historyApiFallback: true
  },

  // Optimization settings for production build
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        phaser: {
          test: /[\\/]node_modules[\\/]phaser[\\/]/, // Match Phaser in node_modules
          name: 'phaser',                              // Name the chunk "phaser"
          chunks: 'all',
          priority: 10
        }
      }
    }
  },

  // Set performance limits to prevent large bundle warnings
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
