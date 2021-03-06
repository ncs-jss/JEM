const mongoose = require('mongoose')

var EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 1200
  },
  date: {
    type: String,
    required: true,
    maxlength: 100
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
  },
  creatorname: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
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
