const express = require('express');
const db = require('./models');
const server = express();
const port = 3000;

server.get('/', (req, res) => {
  res.send('connected');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const book = db.Book;

//book.sync({ force: true });
