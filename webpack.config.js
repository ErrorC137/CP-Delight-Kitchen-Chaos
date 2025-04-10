const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Use a simple string entry to generate a main chunk called "bundle.js"
  entry: './src/game/main.js',

  output: {
    // Output directory for GitHub Pages
    path: path.resolve(__dirname, 'docs'),
    // Main bundle will be named "bundle.js"
    filename: 'bundle.js',
    // Vendor or other chunks will use their chunk names so that they do not conflict
    chunkFilename: '[name].bundle.js',
    // Use a relative path so that GitHub Pages can correctly load assets
    publicPath: './'
  },

  module: {
    rules: [
      {
        // Transpile JavaScript using Babel
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        // Process images, JSON, and other assets. They will be output to "docs/assets/"
        test: /\.(png|jpe?g|gif|svg|json)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      // Ensure Phaser resolves correctly.
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js')
    }
  },

  plugins: [
    // Generate index.html with automatically injected bundle <script> tags
    new HtmlWebpackPlugin({
      template: 'src/index.html', // Source template
      filename: 'index.html',       // Output file in "docs" directory
      inject: 'body'                // Inject scripts at the end of the body
    })
  ],

  devServer: {
    // Development server settings for local testing.
    static: path.join(__dirname, 'docs'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    historyApiFallback: true
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        // If Phaser gets split into a separate chunk, name it "phaser.bundle.js"
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
    // Prevent large asset warnings.
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
