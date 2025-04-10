const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point for your game
  entry: './src/game/main.js',

  // Output configuration for GitHub Pages (serves from /docs)
  output: {
    path: path.resolve(__dirname, 'docs'),    // Output directory for GitHub Pages
    filename: 'bundle.js',                    // Bundled JS file
    publicPath: './'                          // Use relative paths for GitHub Pages
  },

  module: {
    rules: [
      // Transpile JS using Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      // Load image and JSON assets
      {
        test: /\.(png|jpe?g|gif|svg|json)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'      // Output all assets into docs/assets/
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      // Ensure Phaser resolves correctly
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js')
    }
  },

  plugins: [
    // Auto-generates index.html with <script> injected
    new HtmlWebpackPlugin({
      template: 'src/index.html',             // Use our template
      filename: 'index.html',                 // Output to docs/index.html
      inject: 'body'                          // Inject script at the end of <body>
    })
  ],

  // Optional but useful during development
  devServer: {
    static: path.join(__dirname, 'docs'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    historyApiFallback: true
  },

  // Optimize final bundle
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

  // Performance constraints to avoid warnings
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
