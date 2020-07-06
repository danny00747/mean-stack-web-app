//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Question = require('../models/questions');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();


chai.use(chaiHttp);

describe('Questions', () => {

    beforeEach((done) => { //Before each test we empty the database
        Question.deleteMany({}, (err) => {
            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET questions', () => {

        it('it should GET no question since there is none in the database', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .get(`/server/api/questions`)
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(204);
                            res.body.should.be.a('object');
                            Object.keys(res.body).length.should.be.eql(0);
                            done();
                        });
                });
        });

        it('it should get all questions', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = new Question({
                "type": "boolean", "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .post('/server/api/questions')
                        .send(question)
                        .set('Authorization', res1.body.token)
                        .end(() => {
                            chai.request(server)
                                .get('/server/api/questions')
                                .set('Authorization', res1.body.token)
                                .end((err, res2) => {
                                    res2.should.have.status(200);
                                    res2.body.should.be.a('array');
                                    res2.body.length.should.be.eql(1);

                                });
                        });
                    done();
                });
        });
    });

    /*
      * Test the /POST route
      */
    describe('/POST questions', () => {

        it('it should NOT POST a question without a type field', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = {
                "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .post('/server/api/questions')
                        .send(question)
                        .set('Authorization', res.body.token)
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
        });

        it('it should POST a question ', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = new Question({
                "type": "boolean", "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .post('/server/api/questions')
                        .send(question)
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.createdQuestion.should.be.a('object');
                            res.body.should.have
                                .property('message')
                                .eql('Created question successfully !');
                            done();
                        });
                });
        });

    });


    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id question', () => {

        it('it should GET a question by the given id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = new Question({
                "type": "boolean",
                "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .post('/server/api/questions')
                        .send(question)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            const questionId = res2.body.createdQuestion.id;
                            chai.request(server)
                                .get(`/server/api/questions/${questionId}`)
                                .set('Authorization', res1.body.token)
                                .end((err, res3) => {
                                    res3.should.have.status(200);
                                    res3.body[0].should.have
                                        .property('question')
                                        .eql("what's 2000 - 150 ?");
                                });
                        });
                    done();
                });
        });

        it('it should NOT GET a question with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .get('/server/api/questions/92640se51167daq4c81f4312')
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

        it('it should NOT GET a question with a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .get('/server/api/questions/1f468dbf5082002118fc8821')
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have
                                .property('message')
                                .eql('No valid entry found for provided ID');
                            done();
                        });
                });
        });

    });

    /*
    * Test the /PATCH/:id route
    */
    describe('/PATCH/:id question', () => {

        it('it should NOT PATCH a question with a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = {
                "type": "boolean",
                "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .patch('/server/api/questions/5e97314f7cb39f58e4e21ed6')
                        .send(question)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.be.a('object');
                            res2.body.should.have
                                .property('message')
                                .eql('No valid entry found for provided ID');
                        });
                });
            done();
        });

        it('it should PATCH a question by the given id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = new Question({
                "type": "multiple",
                "question": "what's 22 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .post('/server/api/questions')
                        .send(question)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            const questionId = res2.body.createdQuestion.id;
                            question.type = "boolean";
                            delete Object.values(question)[3]._id;
                            delete Object.values(question)[3].__v;
                            chai.request(server)
                                .patch(`/server/api/questions/${questionId}`)
                                .send(question)
                                .set('Authorization', res1.body.token)
                                .end((err, res3) => {
                                    res3.should.have.status(200);
                                    res3.body.should.have.property('message').eql('Question updated successfully !');
                                    res3.body.should.have.property('modifiedDocs').eql(1);
                                });
                        });
                });
            done();
        });

        it('it should NOT PATCH a question with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .patch('/server/api/questions/92640se51167daq4c81f4312')
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

    });

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id question', () => {

        it('it should DELETE a question by the given id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const question = new Question({
                "type": "multiple",
                "question": "what's 22 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });


            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .post('/server/api/questions')
                        .send(question)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            const questionId = res2.body.createdQuestion.id;
                            chai.request(server)
                                .delete(`/server/api/questions/${questionId}`)
                                .set('Authorization', res1.body.token)
                                .end((err, res3) => {
                                    res3.should.have.status(200);
                                });
                        });
                    done();
                });
        });

        it('it should NOT DELETE a question with a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .delete('/server/api/questions/1c7414e51167af71f81f4313')
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have.property('message')
                                .eql('No valid entry found for provided ID');
                        });
                    done();
                });
        });
    });

});
