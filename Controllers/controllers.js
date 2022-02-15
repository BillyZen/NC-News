const {selectTopics, selectArticle, patchArticleById, selectUsers, selectArticles} = require('../Models/models.js')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
    .catch(err => {
        next(err)
    })
}

exports.getArticle = (req, res, next) => {
    const id = req.params.article_id
    selectArticle(id)
    .then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}

exports.updateArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    const updatedVotes = req.body.inc_votes
    patchArticleById(articleId, updatedVotes)
    .then(updatedArticle => {
        res.status(200).send({updatedArticle})
    })
    .catch(err => {
        next(err)
    })
}


exports.getUsers = (req,res,next) => {
    selectUsers()
    .then(users => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}


exports.getArticles = (req,res,next) => {
    selectArticles()
    .then(articles => {
        res.status(200).send({articles})
    })
    .catch(err => {
        next(err)
    })
}