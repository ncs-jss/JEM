var {User} = require('./../models/user')

var authenticate = (req, res, next) => {
  var token = req.header('x-auth')

  if (token === process.env.ADMIN_SECRET) {
    req.user = 'admin'
    next()
  } else {
    User.findByToken(token).then((user) => {
      if (!user) {
        return Promise.reject(new Error('something bad happened'))
      }

      req.user = user
      req.token = token
      next()
    }).catch((e) => {
      res.status(401).send('Unauthorized User, Please login to continue.')
    })
  }
}

module.exports = {authenticate}
