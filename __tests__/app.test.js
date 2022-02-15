const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db//seeds/seed');
const testData = require('../db/data/test-data')

beforeEach(() => seed(testData))

afterAll(() => db.end());

describe("/api/topics", () => {
	describe("GET", () => {
		test("status: 200 returns an array of topic objects, which have the properties slug and description.", () => {
		return request(app)
            .get("/api/topics")
            .expect(200)
            .then(response => {
                expect(response.body.topics).toHaveLength(3)
                response.body.topics.forEach(topic => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
						})
                    );
				});
	        });
        });
        test("status: 404 returns an error message of 404: path not found", () => {
		return request(app)
            .get("/api/topicals")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not found')
	        });
        });
    })
})

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
        test(`status: 200 returns an article object, which should have the following properties:
            authors (which is the username for the users table), title, article_id, body, topic, created_at, votes`, () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
                expect(response.body.article).toEqual({
                            author: 'butter_bridge',
                            title: 'Living in the shadow of a great man',
                            article_id: 1,
                            body: 'I find this existence challenging',
                            topic: 'mitch',
                            created_at: '2020-07-09T20:11:00.000Z',
                            votes: 100
						})
            });
        });
        test("status: 400 returns an error message of 400: bad request", () => {
		return request(app)
            .get("/api/articles/g")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request')
	        });
        });
        test("status: 404 returns an error message of 404: article not found", () => {
		return request(app)
            .get("/api/articles/100")
            .expect(404)
            .then(response => {
                expect(response.body.msg).toBe('No article found for article_id: 100')
	        });
        });
    })

    describe.only("PATCH", () => {
        test('status 201: returns an updated article object which should take new information and update the correct record accordingly', () => {
            const newVotes = { inc_votes : 10 }
            const articleToUpdate = {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: '2020-07-09T20:11:00.000Z'
                }

            return request(app)
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(200)
            .then(response => {
                expect(response.body.updatedArticle).toEqual({
                    ...articleToUpdate,
                    votes: 110
                })
            })
        })
        test('status 404 if article isn\'t found', () => {

            const newVotes = { inc_votes : 10 }
            return request(app)
            .patch("/api/articles/50")
            .send(newVotes)
            .expect(404)
            .then(response => {
                expect(response.body.msg).toBe('No article found for article_id: 50')
            })
        })
        test('status 400: bad request if format is not correct', () => {
            const newVotes = { inc_votes : 10 }
            return request(app)
            .patch("/api/articles/hello")
            .send(newVotes)
            .expect(400)
            .then(response => {
                expect(response.body.msg).toBe('Bad Request')
            })
        })
    })
})