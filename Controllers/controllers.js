const {selectTopics} = require('../Models/models.js')

exports.getTopics = (req, res) => {
    selectTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
    .catch(err => {
        next(err)
    })
}