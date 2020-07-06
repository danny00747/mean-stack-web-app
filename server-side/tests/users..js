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

        it('it should login a user', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
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

        it('it should NOT login a user with a wrong password', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": "***************"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql('Auth failed');
                    res.body.should.have.property('success').eql(false);
                });
            done();
        });

        it('it should NOT login a user if some required field(s) are missing', (done) => {

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

    describe('/singup user', () => {

        it('it should create a user', (done) => {

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
                    User.deleteOne({username: "dan330"})
                        .exec().then().catch();
                    done();
                });
        });

        it("it should NOT create a user if the username's length is (>= 9 && <= 4)", (done) => {

            const user = {
                "username": "da",
                "email": "dan330@gmail.com",
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message')
                        .eql("Username's min length is 4 and max 9 !");

                    res.body.should.have.property('success')
                        .eql(false);

                    done();
                });
        });

        it('it should NOT create a user if some required field(s) are missing', (done) => {

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

        it('it should NOT create a user if he/she already exists', (done) => {

            const user = {
                "username": "admin",
                "email": "admin10@gmail.com",
                "password": "***********************"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have
                        .property('success')
                        .eql(false);
                    res.body.should.have
                        .property('message')
                        .eql('Mail or Username already exists !');
                    done();
                });
        });
    });

    describe('/GET users', () => {

        it('it should GET all users', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
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

        it('it should NOT GET all user with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .get('/server/api/users/profiles')
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

        it('it should NOT GET all users if the request is sent by a student', (done) => {

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
                            res.body.should.have
                                .property('message')
                                .eql("You don't have enough permission to perform this action");
                            done();
                        });
                });
        });

    });

    describe('/GET/:id user', () => {

        it('it should GET a user by id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
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

        it('it should NOT GET a user by a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
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

        it('it should NOT GET a user with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .get('/server/api/user/1f468dbf5182002118fc8821')
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

        it("it should check that a student can't get/see another student's profile", (done) => {

            const user = Math.random().toString(36).substr(2, 4);
            const user0 = Math.random().toString(36).substr(2, 4);

            const user1 = {
                "username": user,
                "email": `${user}@gmail.com`,
                "password": "toto"
            };

            const user2 = {
                "username": user0,
                "email": `${user0}@gmail.com`,
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user1)
                .end(() => {
                    chai.request(server)
                        .post('/server/api/signup')
                        .send(user2)
                        .end((err, res2) => {
                            chai.request(server)
                                .post('/server/api/login')
                                .send({
                                    "pseudo": user,
                                    "password": "toto"
                                })
                                .end((err, res3) => {
                                    chai.request(server)
                                        .get(`/server/api/user/${res2.body.user.userId}`)
                                        .set('Authorization', res3.body.token)
                                        .end((err, res3) => {
                                            res3.should.have.status(403);
                                            res3.body.should.have
                                                .property('message')
                                                .eql("You don't have enough permission to perform this action !");
                                            done();
                                        });
                                });
                        });
                });
        });

    });

    describe('/PATCH/:id user', () => {

        it('it should PATCH a user by id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {

                    delete user.pseudo;
                    user.email = `${process.env["ADMIN_PSEUDO"]}@gmail.com`;

                    chai.request(server)
                        .patch(`/server/api/user/${process.env.ADMIN_ID}`)
                        .set('Authorization', res.body.token)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have
                                .property('message')
                                .eql('User info updated successfully');
                            res.body.should.have
                                .property('modifiedDocs')
                                .eql(1);
                            done();
                        });
                });
        });

        it('it should NOT PATCH a user by a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {

                    delete user.pseudo;

                    chai.request(server)
                        .patch(`/server/api/user/7e7fd1d5f71b123cbc246700`)
                        .set('Authorization', res.body.token)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have
                                .property('message')
                                .eql('No valid entry found for provided ID');
                            done();
                        });
                });
        });

        it('it should NOT PATCH a user with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .patch('/server/api/user/1f468dbf5182002118fc8821')
                        .send(user)
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

        it("it should check that a student can't update another student's profile", (done) => {

            const user = Math.random().toString(36).substr(2, 4);
            const user0 = Math.random().toString(36).substr(2, 4);

            const user1 = {
                "username": user,
                "email": `${user}@gmail.com`,
                "password": "toto"
            };

            const user2 = {
                "username": user0,
                "email": `${user0}@gmail.com`,
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user1)
                .end(() => {
                    chai.request(server)
                        .post('/server/api/signup')
                        .send(user2)
                        .end((err, res2) => {
                            chai.request(server)
                                .post('/server/api/login')
                                .send({
                                    "pseudo": user,
                                    "password": "toto"
                                })
                                .end((err, res3) => {
                                    chai.request(server)
                                        .patch(`/server/api/user/${res2.body.user.userId}`)
                                        .set('Authorization', res3.body.token)
                                        .end((err, res3) => {
                                            res3.should.have.status(403);
                                            res3.body.should.have
                                                .property('message')
                                                .eql("You don't have enough permission to perform this action !");
                                            done();
                                        });
                                });
                        });
                });
        });

        it('it should NOT PATCH a user if request body contains unallowed fields', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {

                    user.phone = "0815713693";

                    chai.request(server)
                        .patch(`/server/api/user/${process.env.ADMIN_ID}`)
                        .set('Authorization', res.body.token)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(405);
                            res.body.should.have
                                .property('message')
                                .eql('Some fields are NOT allowed');
                            done();
                        });
                });
        });

    });

    describe('/DELETE/:id user', () => {

        it('it should DELETE a user by id', (done) => {

            const user = Math.random().toString(36).substr(2, 4);

            const user1 = {
                "username": user,
                "email": `${user}@gmail.com`,
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user1)
                .end(() => {
                    chai.request(server)
                        .post('/server/api/login')
                        .send({
                            "pseudo": user,
                            "password": "toto"
                        })
                        .end((err, res1) => {
                            chai.request(server)
                                .delete(`/server/api/user/${res1.body.user.userId}`)
                                .set('Authorization', res1.body.token)
                                .end((err, res2) => {
                                    res2.should.have.status(200);
                                    res2.body.should.have
                                        .property('message')
                                        .eql('User deleted successfully !');
                                    done();
                                });
                        });
                });
        });

        it('it should NOT DELETE a user by a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .delete(`/server/api/user/7e7fd1d5f71b123cbc246700`)
                        .set('Authorization', res.body.token)
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have
                                .property('message')
                                .eql('No user found for the provided ID');
                            done();
                        });
                });
        });

        it('it should NOT DELETE a user with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .delete('/server/api/user/1f468dbf5182002118fc8821')
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

        it("it should check that a student can't delete another student's profile", (done) => {

            const user = Math.random().toString(36).substr(2, 4);
            const user0 = Math.random().toString(36).substr(2, 4);

            const user1 = {
                "username": user,
                "email": `${user}@gmail.com`,
                "password": "toto"
            };

            const user2 = {
                "username": user0,
                "email": `${user0}@gmail.com`,
                "password": "toto"
            };

            chai.request(server)
                .post('/server/api/signup')
                .send(user1)
                .end(() => {
                    chai.request(server)
                        .post('/server/api/signup')
                        .send(user2)
                        .end((err, res2) => {
                            chai.request(server)
                                .post('/server/api/login')
                                .send({
                                    "pseudo": user,
                                    "password": "toto"
                                })
                                .end((err, res3) => {
                                    chai.request(server)
                                        .delete(`/server/api/user/${res2.body.user.userId}`)
                                        .set('Authorization', res3.body.token)
                                        .end((err, res3) => {
                                            res3.should.have.status(403);
                                            res3.body.should.have
                                                .property('message')
                                                .eql("You don't have enough permission to perform this action !");
                                        });
                                });
                        });
                    done();
                });
        });


    });


    describe('/PATCH/:id/score', () => {

        it("it should PATCH the user's score ", (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .patch(`/server/api/user/${res1.body.user.userId}/score`)
                        .send({ "score" : 10})
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(200);
                            res2.body.should.have
                                .property('message')
                                .eql('User info updated successfully');
                        });
                    done();
                });
        });

        it("it should NOT PATCH the user's score if it exceeds 10", (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .patch(`/server/api/user/${res1.body.user.userId}/score`)
                        .send({ "score" : 123})
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(405);
                            res2.body.should.have
                                .property('message')
                                .eql('The max score is 10');
                        });
                    done();
                });
        });
    });
});
