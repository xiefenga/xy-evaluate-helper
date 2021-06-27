const { join } = require('path');
const AddUserScriptPlugin = require('../plugin/AddUserScriptPlugin');

module.exports = {
  devtool: false,
  plugins: [
    new AddUserScriptPlugin({
      template: join(__dirname, '../public/header.txt'),
      version: require(join(__dirname, '../package.json')).version
    }),
  ]
}