var {User} = require('./../models/user')

var authenticateLogout = (req, res, next) => {
  var token = req.header('x-auth')

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject(new Error('something bad happened'))
    }

    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send()
  })
}

module.exports = {authenticateLogout}
