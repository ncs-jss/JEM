require('./config/config');

// SERVER MODULES
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// DB Connection
const {mongoose} = require('./db/mongoose');
const {ObjectId} = require('mongodb');

// PORT
const PORT = process.env.PORT || 3000;

// MODELS
const {Event} = require('./models/event');

// VIEWS
app.set('view engine', 'hbs');

// ONESIGNAL
const {sendNotification} = require('./onesignal/create');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// LODASH
const _ = require('lodash');

// HOME PAGE WITH EVENTS
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


// RESPONSE FROM HOME PAGE, INCLUDE PLAYER ID AND EVENT ID
app.post('/', async (req, res) => {
  console.log(req.body);
  let id = req.body.event_id;
  let event = await Event.findById({
    _id: id
  });

  var EventDate = new Date(event.date);

  var NotiDate = new Date( EventDate.getTime() - 20000 * 60 );

  var message = {
    app_id: "d3d99984-794f-4c25-bedb-5cb810d8ed86",
    contents: {"en": `Your event ${event.name} is going to start in 20 minutes`},
    send_after: NotiDate,
    include_player_ids: [req.body.user_id]
  };

   sendNotification(message, (err, result) => {
       event.notification_id.push(result.id);
         var x = event;
         x.save();
      
   });

});

// CREATE EVENT
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

// SHOW EVENT WITH ID

app.get('/events/:id', async (req, res) => {
  const id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(400).send();
  }

  try {
    const event = await Event.findById(id);
      if(!event){
        return res.status(400).send();
      }

      res.status(200).send({event});

    } catch(e) {
      res.status(400).send(e);
    }
});

// DELETE EVENT ROUTE

app.delete('/events/:id', async (req, res) => {
  const id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  try {
    const event = await Event.findByIdAndRemove(id);

    if(!event){
      return res.status(404).send();
    }

    res.send({event});
  } catch(e) {
    res.status(400).send();
  };
});

// UPDATE EVENT WITH GIVEN EVENT ID
app.patch('/events/:id', async (req, res) => {


  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'description', 'date']);

  if(!ObjectId.isValid(id)){
    return res.status(400).send();
  }

  body.name = req.body.name;
  body.description = req.body.description;
  body.date = req.body.date;

  try {
  const event = await Event.findByIdAndUpdate(id, {$set: body}, {new: true});
  res.status(200).send(event);
  } catch(e) {
  res.status(400).send();
  }
});

// SERVER CONNECTION
app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
