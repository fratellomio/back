const express = require('express');
const server = express();
const port = 3000;

server.get('/', (req, res) => {
  res.send('connected');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
