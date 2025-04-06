const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/game/main.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/CP-Delight-Kitchen-Chaos/',
    globalObject: 'this'
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
            plugins: [
              ['@babel/plugin-transform-runtime', {
                regenerator: true
              }]
            ]
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
      meta: {
        'Content-Security-Policy': {
          'http-equiv': 'Content-Security-Policy',
          'content': [
            "default-src 'self'",
            "connect-src 'self' ws: wss: https://your-actual-server.com", // ← MUST replace with your real backend URL
            "img-src 'self' data: blob: https://cdn.jsdelivr.net",
            "media-src 'self' data: blob:",
            "script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://cdn.socket.io",
            "style-src 'self' 'unsafe-inline'",
            "worker-src 'self' blob:"
          ].join('; ')
        }
      }
    })
  ],
  resolve: {
    extensions: ['.js'],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify")
    }
  },
  optimization: {
    minimize: true,
    usedExports: true,
    splitChunks: {
      chunks: 'all'
    }
  }
};
