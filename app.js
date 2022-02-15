const express = require('express');
const { getTopics, getArticle } = require('./Controllers/controllers');
const {handle500, handlePsqlErrors, handleCustomErrors} = require('./Controllers/errors')
const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Not found' });
});

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handle500);

module.exports = app;
