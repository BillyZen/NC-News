const {selectTopics, selectArticle} = require('../Models/models.js')

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
        console.log(article)
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}