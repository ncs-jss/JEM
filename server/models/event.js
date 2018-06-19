const mongoose = require('mongoose');


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
      default: new Date()
    },
    notification_id: [{
      type: String,
    }],
    player_id: [{
      type: String,
    }],
    creator : {
      type: String,
      required: true
    }
  });

  var Event = mongoose.model('Event', EventSchema);

module.exports = {Event};
