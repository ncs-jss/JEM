require('./config/config');

// SERVER
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// DB Connection
const {mongoose} = require('./db/mongoose');

// PORT
const PORT = process.env.PORT || 3000;

// MODELS
const {Event} = require('./models/event');

//VIEWS
app.set('view engine', 'hbs');

// ONESIGNAL
const {sendNotification} = require('./onesignal/create');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//
// const event = new Event({
//   name: 'sad',
//   description: 'sadasd'
// });
//
// console.log(event);
// var items = {
//   item1: {
//     _id: 1,
//     name: 'EVENT1'
//   },
//   item2: {
//     _id: 2,
//     name: 'EVENT2'
//   }
// }



app.get('/', async (req, res) => {
  try {
    let events = await Event.find({});
     // res.send(JSON.stringify(events, undefined, 2));
     res.render(__dirname + '/views/home', {
       events
     });
  } catch(e) {
    res.status(400).send(e);
  };

});

app.post('/', async (req, res) => {
  console.log(req.body);
  let id = req.body.event_id;
  let event = await Event.findById({
    _id: id
  });

  var message = {
    app_id: "d3d99984-794f-4c25-bedb-5cb810d8ed86",
    contents: {"en": `Your event ${event.name} is about to start`},
    send_after: event.date,
    include_player_ids: [req.body.user_id]
  };
  sendNotification(message);
});

app.post('/events', async (req, res) => {
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date
  });

  try {
    const doc = await event.save();
    res.send(doc);
  } catch(e) {
    res.status(400).send(e);
  };

});




app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
