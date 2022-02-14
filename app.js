const express = require('express');
const { getTopics } = require('./Controllers/controllers');
const app = express();

app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});


module.exports = app;
