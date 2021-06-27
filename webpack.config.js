const { merge } = require('webpack-merge');
const base = require('./config/base.config')
const dev = require('./config/dev.config');
const prod = require('./config/prod.config');


module.exports = env => {
  console.log(env)
  return merge(base, env.dev ? dev : prod);

}

