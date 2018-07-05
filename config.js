var envfile = '.env'
if (process.env.NODE_ENV === 'prod') {
  envfile = '.env.prod'
}
require('dotenv').config({path: envfile})
