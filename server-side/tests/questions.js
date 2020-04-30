//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Question = require('../models/questions');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Questions', () => {

    /*
     * Test the /GET route
     */
    describe('/GET questions', () => {
        it('it should GET all the question', (done) => {
            chai.request(server)
                .get('/server/api/questions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    /*
      * Test the /POST route
      */
    describe('/POST questions', () => {
        it('it should not POST a book without type field', (done) => {

            const question = {
                "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            };

            chai.request(server)
                .post('/server/api/questions')
                .send(question)
                .end((err, res) => {
                    res.should.have.status(405);
                    res.body.should.have
                        .property('message').eql('Invalid input');
                    res.body.error.should.have
                        .property('name').eql('ValidationError');
                    res.body.error.should.have.property('errors');
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('it should POST a question ', (done) => {
            const question = {"type": "boolean", "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            };
            chai.request(server)
                .post('/server/api/questions')
                .send(question)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have
                        .property('createdQuestion');
                    done();
                });
        });
    });


    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id question', () => {
        it('it should GET a question by the given id', (done) => {

            const questionId = '5e6444e51167df04c81f43e4';
                chai.request(server)
                    .get('/server/api/questions/' + questionId)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body[0].answers.should.be.a('array');
                        res.body[0].should.have
                            .property('question');
                        done();
                    });
        });
    });

    /*
    * Test the /PATCH/:id route
    */
    describe('/PATCH/:id question', () => {
        it('it should not PATCH a question by the given id', (done) => {

            const questionId = '5e97354f3fb39f58e4e21ed6';
            chai.request(server)
                .patch('/server/api/questions/' + questionId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have
                        .property('message')
                        .eql('No valid entry found for provided ID');
                    done();
                });
        });

        it('it should PATCH a question by the given id', (done) => {

            const  questionId = '5e97354f3fb39f58e4e21ed6';
            const question = {
                "type": "boolean",
                "question": "is 20 / 200 equal to 10 ?",
                "answers": [{"option": "true", "isCorrect": false},
                    {"option": "false", "isCorrect": true}]
            };

            chai.request(server)
                .patch('/server/api/questions/' + questionId)
                .send(question)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have
                        .property('message')
                        .eql('Question updated successfully !');
                    done();
                });
        });
    });

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id question', () => {
        it('it should not DELETE a question by the given id', (done) => {
            let questionId = '5e97354f3fb39f58e4e21ess';
            chai.request(server)
                .delete('/server/api/questions/' + questionId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have
                        .property('message')
                        .eql('An error occured while trying to delete this question');
                    done();
                });
        });
    })
});









/*
* Test the /GET/:id route

it('it should POST a question ', (done) => {
    let question = {
        "type": "boolean",
        "question": "what's 2000 - 150 ?",
        "answers": [
            {
                "option": "true",
                "isCorrect": true
            },
            {
                "option": "false",
                "isCorrect": false
            }
        ]
    };
    chai.request(server)
        .post('/server/api/questions')
        .send(question)
        .end((err, res) => {
            console.log(res.body);
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have
                .property('createdQuestion');
            done();
        });
});

* */
