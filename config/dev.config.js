const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: join(__dirname, 'dist'),
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, '../public/index.html')
    })
  ]
}