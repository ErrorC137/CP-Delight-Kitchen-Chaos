const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/game/main.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/CP-Delight-Kitchen-Chaos/',
    globalObject: 'this' // Critical for Phaser+SES compatibility
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
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      meta: { // 👈 This section needs to be added
        'Content-Security-Policy': {
          'http-equiv': 'Content-Security-Policy',
          'content': [
            "default-src 'self'",
            "connect-src 'self' ws: wss: https://errorc137.github.io/CP-Delight-Kitchen-Chaos/", // 👈 Replace with your real server URL
            "img-src 'self' data: https://cdn.jsdelivr.net",
            "media-src 'self' data:",
            "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.socket.io",
            "style-src 'self' 'unsafe-inline'"
          ].join('; ')
        }
      }
    })
  ]
};
  resolve: {
    extensions: ['.js'],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify")
    }
  },
  optimization: {
    minimize: true,
    usedExports: true
  }
};
