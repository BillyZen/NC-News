const {selectTopics} = require('../models/topics.js')

exports.getTopics = (req, res) => {
    selectTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
    .catch(err => {
        next(err)
    })
}