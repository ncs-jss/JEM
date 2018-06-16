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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//
// const event = new Event({
//   name: 'sad',
//   description: 'sadasd'
// });
//
// console.log(event);
var items = {
  item1: {
    name: 'asdad'
  },
  item2: {
    name: 'rahul'
  }
}

app.get('/', (req, res) => {
    res.render(__dirname + '/views/home', {
    });
});

app.post('/', (req, res) => {
  console.log(req.body);

});



app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
