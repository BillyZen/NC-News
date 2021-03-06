const db = require('../db/connection')
const {readFile} = require("fs/promises")

exports.readEndpointsFile = () => {
    return readFile("./endpoints.json", "utf-8")
    .then(fileContents => {
        const endpoints = JSON.parse(fileContents)
        return endpoints
    })
}

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


exports.selectArticles = (query) => {

    const validKeys = ["topic", "order", "sort_by"]

    for (key in query) {
        if (validKeys.includes(key) !== true) {
            return Promise.reject({ status: 400, msg: 'Query is using incorrect format' });
        }
    }

    const queryValues = []
    const sort_by = query.sort_by || "created_at"
    const order = query.order || "DESC"

    if (!['title', 'topic', 'author', 'created_at', 'votes', 'comment_count'].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort query' });
    }
    if (!['asc', 'DESC'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }

    let queryStr = `
    SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.votes, articles.topic,
    COUNT(comments.comment_id)::int AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

    const topicArr = ['coding', 'cooking', 'football', 'cats', 'mitch', 'paper']
    
    if(query.topic){
        if(topicArr.includes(query.topic)) {
            queryValues.push(query.topic)
            queryStr += ` WHERE topic = $1`
        } else {
            return Promise.reject({ status: 400, msg: 'Topic does not exist' });
        }
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`

    return db.query(queryStr, queryValues)
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
        return rows[0]
    })
}


exports.removeCommentById = id => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [id])
    .then(({rows}) => {
        if(rows[0]) return rows
        else {
            return Promise.reject({
                status: 400,
                msg : `Comment does not exist and cannot be deleted`
            })
        }
    })
}