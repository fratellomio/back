const express = require('express');
const db = require('./models');
const server = express();
const port = 8000;
const cors = require('cors');
const { bookRoutes, authRoutes } = require('./routes');
const bearerToken = require('express-bearer-token');

server.use(express.json());
server.use(cors());
server.use(bearerToken());
server.use(bookRoutes);
server.use(authRoutes);
// server.use('/auth', authRoutes);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// const book = db.Book;
// const user = db.User;

// book.sync({ alter: true });
// user.sync({ alter: true });
