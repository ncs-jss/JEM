const mongoose = require('mongoose')

var RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  admno: {
    type: String,
    required: true
  },
  branch: {
    type: String
  },
  applyfor: {
    type: String
  },
  eventId: {
    type: String,
    required: true
  }
})

var Registration = mongoose.model('Registration', RegistrationSchema)

module.exports = {Registration}
