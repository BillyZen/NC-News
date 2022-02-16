const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticle = (id) => {

    return db.query(`SELECT articles.*,
    COUNT(comments.comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
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
    return db.query(`
    SELECT articles.*,
    COUNT(comments.comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id;`)
    .then(({rows}) => {
        return rows
    })
}


exports.selectCommentsByArticle = (id) => {
    return db.query("SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1", [id])
    .then(({rows}) => {
        if(!rows[0]) {
            return Promise.reject({
                status: 404,
                msg : `No comments found for article_id: ${id}`
            })
        }
        return rows
    })
}


exports.createCommentByArticle = (id, userComment) => {
    const username = userComment.username
    const comment = userComment.body
    if(!username || !comment) {
        return Promise.reject({
                status: 400,
                msg : `This comment has not been formatted correctly`
            })
    }
    return db.query("INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;", [username, comment, id])
    .then(({rows}) => {
        console.log(rows)
        return rows[0]
    })
}