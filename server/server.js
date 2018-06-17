require('./config/config');

// SERVER
const express = require('express');
const app = express();

// DB Connection
const {mongoose} = require('./db/mongoose');

// PORT
const PORT = process.env.PORT || 3000;

// MODELS
const {Event} = require('./models/event');

const event = new Event({
  name: 'sad',
  description: 'sadasd'
});

console.log(event);

app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
