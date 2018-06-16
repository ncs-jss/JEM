const mongoose = require('mongoose');

var Event = mongoose.model('Event', {
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: String,
    default: new Date()
  }
});

module.exports = {Event};
