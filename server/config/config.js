const env = process.env.NODE_ENV || 'development'

if (env === 'development' || env === 'test') {
  let config = require('./config.json')
  let envconfig = config[env]

  Object.keys(envconfig).forEach((key) => {
    process.env[key] = envconfig[key]
  })
}
