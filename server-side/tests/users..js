//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let User = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();


describe('Users', () => {

    /*
     * Test the /login route
     */
    describe('/login user', () => {

        it('it should login a user',  (done) => {

            const user = {
                "pseudo": "dan30",
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have
                        .property('message')
                        .eql('Auth successful');
                    res.body.should.have
                        .property('token');
                    done();
                });
        });

        it('it should NOT login a user', (done) => {

            const user = {
                "pseudo": "admin"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have
                        .property('message')
                        .eql('All fields required');
                    done();
                });
        });
    });

    describe('/singup user',  () => {

        it('it should create a user',  (done) => {

            const user = {
                "username": "dan330",
                "email": "dan330@gmail.com",
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have
                        .property('message')
                        .eql('User created successfully');
                    res.body.should.have
                        .property('user');
                    done();
                });

           User.deleteOne({username: "dan330"}).exec().then().catch();
        });

        it('it should NOT create a user', (done) => {

            const user = {
                "username": "dan330",
                "email": "dan330@gmail.com",
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have
                        .property('message')
                        .eql('All fields required');
                    done();
                });
        });
    });

    describe('/GET users',  () => {

        it('it should get all users',  (done) => {

            const user = {
                "pseudo": "admin",
                "password": process.env.ADMIN_PSD
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .get('/server/api/users/profiles')
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('array');
                            done();
                        });
                });
        });

        it('it should NOT get all users',  (done) => {

            const user = {
                "pseudo": "dan30",
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .get('/server/api/users/profiles')
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(403);
                            done();
                        });
                });
        });

    });

    describe('/GET/:id user',  () => {

        it('it should get a user by id',  (done) => {

            const user = {
                "pseudo": "admin",
                "password": process.env.ADMIN_PSD
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .get(`/server/api/user/${process.env.ADMIN_ID}`)
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.should.have
                                .property('user');
                            done();
                        });
                });
        });

        it('it should NOT get a user by id',  (done) => {

            const user = {
                "pseudo": "admin",
                "password": process.env.ADMIN_PSD
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .get(`/server/api/user/7e7fd1d5f71b123cbc246700`)
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.be.an('object');
                            res.body.should.have
                                .property('message')
                                .eql('No valid entry found for provided ID');
                            done();
                        });
                });
        });

    });
});
