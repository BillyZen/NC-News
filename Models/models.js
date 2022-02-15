const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticle = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article) {
            return Promise.reject({
                status: 404,
                msg : `No article found for article_id: ${id}`
            })
        }
        return article
    })
}


exports.patchArticleById = (id, votes) => {
    if(!votes) {
        return Promise.reject({
                status: 400,
                msg : 'Incorrect request body format'
            })
    } else {
        return db.query('SELECT votes FROM articles WHERE article_id = $1;', [id])
        .then(voteData => {
            if(!voteData.rows[0]){
                return Promise.reject({
                    status: 404,
                    msg : `No article found for article_id: ${id}`
                })
            } else {
                const oldVotes = voteData.rows[0].votes
                const newVotes = oldVotes + votes
                return newVotes
            }     
        })
        .then(newVotes => {
            return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;', [newVotes, id])
        })
        .then(({rows}) => {
            const article = rows[0]
            return article
        })
    }
}


exports.selectUsers = () => {
    return db.query('SELECT username FROM users;')
    .then(({rows}) => {
        return rows
    })
}


exports.selectArticles = () => {
    return db.query('SELECT * FROM articles ORDER BY created_at DESC;')
    .then(({rows}) => {
        return rows
    })
}