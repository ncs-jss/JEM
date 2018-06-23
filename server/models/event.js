const mongoose = require('mongoose')

var EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
  isodate: {
    type: Date
  },
  notification_id: [{
    type: String
  }],
  player_id: [{
    type: String
  }],
  creator: {
    type: String,
    required: true
  }
})

EventSchema.pre('save', function (next) {
  var event = this
  if (event.isModified('date')) {
    event.isodate = event.date
    next()
  } else {
    next()
  }
})

var Event = mongoose.model('Event', EventSchema)

module.exports = {Event}
