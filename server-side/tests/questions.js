//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Question = require('../models/questions');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
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
        it('it should GET all the question', (done) => {
            chai.request(server)
                .get('/server/api/questions')
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.a('object');
                    Object.keys(res.body).length.should.be.eql(0);
                    done();
                });
        });
    });

    /*
      * Test the /POST route
      */
    describe('/POST questions', () => {
        it('it should not POST a book without a type field', (done) => {

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
        it('it should GET a question by the given id', async () => {

            const question = new Question({"type": "boolean",
                "question": "what's 2000 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });
            await question.save();

            const questionId = Object.values(question)[3]._id;

                chai.request(server)
                    .get(`/server/api/questions/${questionId}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body[0].should.have
                            .property('question')
                            .eql("what's 2000 - 150 ?");

                    });
        });
    });

    /*
    * Test the /PATCH/:id route
    */
    describe('/PATCH/:id question', () => {
        it('it should not PATCH a question with a wrong id', (done) => {

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

        it('it should PATCH a question by the given id', async () => {

            const question = new Question({"type": "multiple",
                "question": "what's 22 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });

            await question.save();

            question.type = "boolean";
            const questionId = Object.values(question)[3]._id;

            delete Object.values(question)[3]._id;
            delete Object.values(question)[3].__v;


            chai.request(server)
                .patch(`/server/api/questions/${questionId}`)
                .send(question)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property('message')
                        .eql('Question updated successfully !');
                    res.body.should.have.property('modifiedDocs')
                        .eql(1);

                });
        });
    });

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id question', () => {
        it('it should DELETE a question by the given id', async () => {

            const question = new Question({"type": "multiple",
                "question": "what's 22 - 150 ?",
                "answers": [{"option": "true", "isCorrect": true},
                    {"option": "false", "isCorrect": false}
                ]
            });

            await question.save();
            const questionId = Object.values(question)[3]._id;

            chai.request(server)
                .delete(`/server/api/questions/${questionId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message')
                        .eql('Question deleted successfully !');
                });
        });

        it('it should not DELETE a question with a wrong id', (done) => {

            const questionId = '7eab24dee08248016851dd3';

            chai.request(server)
                .delete(`/server/api/questions/${questionId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message')
                        .eql('An error occured while trying to delete this question');
                    done();
                });
        });
    });

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
