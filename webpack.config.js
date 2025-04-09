// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/game/main.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|json)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};
