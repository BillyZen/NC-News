const express = require('express');
const { getTopics, getArticle, updateArticleById } = require('./Controllers/controllers');
const {handle500, handlePsqlErrors, handleCustomErrors} = require('./Controllers/errors')
const app = express();
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle);
app.patch('/api/articles/:article_id', updateArticleById);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Not found' });
});

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handle500);

module.exports = app;
