require('./../config.js')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('./db/mongoose')
const PORT = process.env.PORT

// VIEWS
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('x-auth', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-auth')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

require('./routes')(app)

// SERVER CONNECTION
app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT)
})
