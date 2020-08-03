//During the test the env variable is set to test

process.env.NODE_ENV = 'test';

import Question from '../../models/questions'

//bring in dev-dependencies
import chai from 'chai';
import {describe, before, it, after} from 'mocha';
import chaiHttp from 'chai-http';

chai.should();
chai.expect;

import server from '../../../app';
import env from '../../config/environment';

chai.use(chaiHttp);

describe('Questions', () => {

    let loginUser = "";
    let postedQuestion = "";

    const question = {
        "type": "multiple",
        "question": "what's 22 - 150 ?",
        "answers": [{"option": "true", "isCorrect": true},
            {"option": "false", "isCorrect": false}]
    };

    const user = {
        "pseudo": env.ADMIN_PSEUDO,
        "password": env.ADMIN_PSD,
    };

    before(async () => {

        loginUser = await chai.request(server)
            .post('/server/api/login')
            .send(user);

        postedQuestion = await chai.request(server)
            .post('/server/api/questions')
            .set('Authorization', loginUser.body.token)
            .send(question);
    });

    //Before each test we empty the database
    after(async () => {
        await Question.deleteMany({});
    });

    /*
     * Test the /GET route
     */
    describe('/GET questions', () => {

        it('it should GET all questions', async () => {

            const getQuestion = await chai.request(server)
                .get('/server/api/questions')
                .set('Authorization', loginUser.body.token);

            getQuestion.status.should.be.eql(200);
            getQuestion.body.should.be.a('array');
        });

        it('it should NOT GET all question with a missing or invalid JWT', async () => {

            const getQuestions = await chai.request(server)
                .get('/server/api/questions');

            const getQuestions2 = await chai.request(server)
                .get('/server/api/questions')
                .set('Authorization', "abc");

            getQuestions.status.should.be.eql(401);
            getQuestions2.status.should.be.eql(401);

        });
    });

    /*
     * Test the /POST route
    */
    describe('/POST questions', () => {

        it('it should POST a question ', async () => {

            postedQuestion.status.should.be.eql(201);
            postedQuestion.body.should.be.a('object');
            postedQuestion.body.createdQuestion.should.be.a('object');
            postedQuestion.body.should.have.property('message')
                .eql('Created question successfully !');
        });

        it('it should NOT POST a question with a missing or invalid JWT', async () => {

            const createdQuestion = await chai.request(server)
                .post('/server/api/questions')
                .set('Authorization', "abc")
                .send(question);

            const createdQuestion2 = await chai.request(server)
                .post('/server/api/questions')
                .set('Authorization', "abc")
                .send(question);

            createdQuestion.status.should.be.eql(401);
            createdQuestion2.status.should.be.eql(401);

        });

    });

    /*
    *  Test the /GET/:id route
    */
    describe('/GET/:id question', () => {

        it('it should GET a question by the given id', async () => {

            const qst = await chai.request(server)
                .get(`/server/api/questions/${postedQuestion.body.createdQuestion.id}`)
                .set('Authorization', loginUser.body.token);

            qst.status.should.be.eql(200);
            qst.body[0].should.have
                .property('question')
                .eql("what's 22 - 150 ?");

        });

        it('it should NOT GET a question with a missing or invalid JWT', async () => {

            const qst = await chai.request(server)
                .get(`/server/api/questions/123`)
                .set('Authorization', "abc");

            const qst2 = await chai.request(server)
                .get('/server/api/questions/123');

            qst.status.should.be.eql(401);
            qst2.status.should.be.eql(401);

        });

        it('it should NOT GET a question with a wrong id', async () => {

            const qst = await chai.request(server)
                .get(`/server/api/questions/1f468dbf5082002118fc8821`)
                .set('Authorization', loginUser.body.token);

            qst.status.should.be.eql(404);
            qst.body.should.have
                .property('message')
                .eql('No valid entry found for provided id');
        });

    });

    /*
    * Test the /PATCH/:id route
    */
    describe('/PATCH/:id question', () => {

        it('it should NOT PATCH a question with a wrong id', async () => {

            const qst = await chai.request(server)
                .patch(`/server/api/questions/5e97314f7cb39f58e4e21ed6`)
                .send(question)
                .set('Authorization', loginUser.body.token);

            qst.status.should.be.eql(404);
            qst.body.should.be.a('object');
            qst.body.should.have
                .property('message')
                .eql('No valid entry found for provided id');
        });

        it('it should PATCH a question by the given id', async () => {

            question.type = "boolean";

            const qst = await chai.request(server)
                .patch(`/server/api/questions/${postedQuestion.body.createdQuestion.id}`)
                .set('Authorization', loginUser.body.token)
                .send(question);

            qst.status.should.be.eql(200);
            qst.body.should.have.property('updatedQuestion');
            qst.body.updatedQuestion.should.have.property('type').eql('boolean');

        });

        it('it should NOT PATCH a question with a missing or invalid JWT', async () => {

            const qst = await chai.request(server)
                .patch('/server/api/questions/123')
                .send(question);

            const qst2 = await chai.request(server)
                .patch('/server/api/questions/123')
                .set('Authorization', "abc")
                .send(question);

            qst.status.should.be.eql(401);
            qst2.status.should.be.eql(401);

        });

    });

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id question', () => {

        it('it should DELETE a question by the given id', async () => {

            const qst = await chai.request(server)
                .delete(`/server/api/questions/${postedQuestion.body.createdQuestion.id}`)
                .set('Authorization', loginUser.body.token);

            qst.status.should.be.equal(200);
            qst.body.should.have.property('message')
                .eql('Question deleted successfully !');

            qst.body.should.have.property('deletedQuestion').eql("what's 22 - 150 ?");

        });

        it('it should NOT DELETE a question with a wrong id', async () => {

            const deletedUser = await chai.request(server)
                .delete('/server/api/questions/1c7414e51167af71f81f4313')
                .set('Authorization', loginUser.body.token);

            deletedUser.status.should.be.equal(404);
            deletedUser.body.should.have.property('message')
                .eql('No valid entry found for provided id .');

        });

        it('it should NOT DELETE a question with a missing or invalid JWT', async () => {

            const qst = await chai.request(server)
                .delete('/server/api/questions/123');

            const qst2 = await chai.request(server)
                .delete('/server/api/questions/123')
                .set('Authorization', "abc");

            qst.status.should.be.eql(401);
            qst2.status.should.be.eql(401);

        });
    });

});
