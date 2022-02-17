const {selectTopics, selectArticle, patchArticleById, selectUsers, selectArticles, selectCommentsByArticle, createCommentByArticle, removeCommentById} = require('../Models/models.js')

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
    const query = req.query
    selectArticles(query)
    .then(articles => {
        res.status(200).send({articles})
    })
    .catch(err => {
        next(err)
    })
}


exports.getCommentsByArticle = (req,res,next) => {
    const id = req.params.article_id
    selectCommentsByArticle(id)
    .then(comments => {
        res.status(200).send({comments})
    })
    .catch(err => {
        next(err)
    })
}


exports.postCommentByArticle = (req,res,next) => {
    const id = req.params.article_id
    const userComment = req.body
    createCommentByArticle(id, userComment)
    .then(comment => {
        res.status(200).send({comment})
    })
    .catch(err => {
        next(err)
    })
}


exports.deleteCommentById = (req,res,next) => {
    const id = req.params.comment_id
    removeCommentById(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}