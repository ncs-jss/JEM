var {User} = require('./../models/user')

var authenticate = (req, res, next) => {
  var token = req.header('x-auth')

  User.findByToken(token).then((user) => {
    if (!user || user.group === 'student') {
      return Promise.reject(new Error('something bad happened'))
    }

    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send('Unauthorized User, Please login to continue.')
  })
}

module.exports = {authenticate}
