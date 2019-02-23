const mongoose = require('mongoose')
require('validator')
const jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  group: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Update your Name',
    maxlength: 50
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

})

UserSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({id: user._id.toHexString(), access}, process.env.secret).toString()

  user.tokens.push({access, token})

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  var user = this

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

UserSchema.statics.findByToken = function (token) {
  var User = this
  var decoded

  try {
    decoded = jwt.verify(token, process.env.secret)
  } catch (e) {
    return Promise.reject(new Error('something bad happened'))
  }

  return User.findOne({
    '_id': decoded.id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

var User = mongoose.model('User', UserSchema)

module.exports = {User}
