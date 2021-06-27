const { join } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: join(__dirname, '../src/main.js')
  },
  output: {
    filename: 'main.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
}