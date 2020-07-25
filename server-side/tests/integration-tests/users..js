//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import chai from 'chai';
import {assert, should, expect} from 'chai';
import {describe, before, it} from 'mocha';
import chaiHttp from 'chai-http';


import server from '../../../app';
import {User} from '../../models/users';
import env from '../../config/environment';

chai.use(chaiHttp);


describe('Users', () => {

    let loginUser = "";

    const user = {
        "pseudo": env.ADMIN_PSEUDO,
        "password": env.ADMIN_PSD,
    };

    const admin = {
        "username": env.ADMIN_PSEUDO,
        "email": `${env.ADMIN_PSEUDO}@gmail.com`,
        "password": env.ADMIN_PSD,
    };

    before(async () => {

        loginUser = await chai.request(server)
            .post('/server/api/login')
            .send(user);
    });

    /*
     * Test the /login route
     */
    describe('/login user', () => {

        it('it should login a user', async () => {

            loginUser.status.should.be.eql(200);
            loginUser.body.should.have.property('token');
            expect(loginUser.body.success).to.be.true;

        });

        it('it should NOT login a user with a wrong password', async () => {

            const fakeUser = {
                "pseudo": env.ADMIN_PSEUDO,
                "password": "xxxxxxxxxxxxxx",
            };

            const loggedIn = await chai.request(server)
                .post('/server/api/login')
                .send(fakeUser);

            loggedIn.status.should.be.eql(401);
            loggedIn.body.should.not.have.property('token');
            expect(loggedIn.body.success).to.be.false;

        });

    });

    /*
     * Test the /signup route
     */
    describe('/singup user', () => {

        it('it should create a new user', async () => {

            const randomUser = Math.random().toString(36).substr(2, 6);

            const newUser = {
                "username": randomUser,
                "email": `${randomUser}@gmail.com`,
                "password": randomUser
            };

            const createdUser = await chai.request(server)
                .post('/server/api/signup')
                .send(newUser);

            createdUser.status.should.be.eql(201);
            createdUser.body.should.have.property('message')
                .eql(`A verification email has been sent to ${newUser.email}`);
            expect(createdUser.body.success).to.be.true;

            await User.findByIdAndRemove({_id: createdUser.body.user.userId}).exec();

        });

        it('it should NOT create a user if he/she already exists', async () => {

            const randomUser = Math.random().toString(36).substr(2, 6);

            const newUser = {
                "username": env.ADMIN_PSEUDO,
                "email": `${randomUser}@gmail.com`,
                "password": randomUser
            };

            const createdUser = await chai.request(server)
                .post('/server/api/signup')
                .send(newUser);

            createdUser.status.should.be.eql(409);
            createdUser.body.should.have.property('message')
                .eql('A user with the same username or email already exists !');
            expect(createdUser.body.success).to.be.false;

        });

    });

    /*
     * Test the /Get route
     */
    describe('/GET users', () => {

        it('it should GET all users', async () => {

            const users = await chai.request(server)
                .get('/server/api/users/profiles')
                .set('Authorization', loginUser.body.token);

            users.status.should.be.eql(200);
            users.body.should.be.an('array');

        });

        xit('it should NOT GET all user with a missing or invalid JWT', async () => {

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

        xit('it should NOT GET all users if the request is sent by a student', async () => {

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

    /*
     * Test the /GET/:id route
     */
    describe('/GET/:id user', () => {

        it('it should GET a user by id', async () => {

            const getUser = await chai.request(server)
                .get(`/server/api/user/${env.ADMIN_ID}`)
                .set('Authorization', loginUser.body.token);

            getUser.status.should.be.eql(200);
            getUser.body.should.be.an('object');
            getUser.body.should.have
                .property('user');

        });

        it('it should NOT GET a user by a wrong id', async () => {

            const getUser = await chai.request(server)
                .get(`/server/api/user/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            getUser.status.should.be.eql(404);
            getUser.body.should.be.an('object');
            getUser.body.should.have.property('message')
                .eql('No valid entry found with provided id');

        });

        xit('it should NOT GET a user with a missing or invalid JWT', (done) => {

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

        xit("it should check that a student can't get/see another student's profile", (done) => {

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

    /*
     * Test the /PATCH/:id route
     */
    describe('/PATCH/:id user', () => {

        it('it should PATCH a user by id', async () => {

            const patchUser = await chai.request(server)
                .patch(`/server/api/user/${env.ADMIN_ID}`)
                .set('Authorization', loginUser.body.token)
                .send(admin);

            patchUser.status.should.be.eql(200);
            expect(patchUser.body.updatedUser.username).to.equal(env.ADMIN_PSEUDO);
            patchUser.body.should.have.property('message')
                .eql('User info updated successfully');

        });

        it('it should NOT PATCH a user by a wrong id', async () => {

            const updateUser = await chai.request(server)
                .patch(`/server/api/user/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token)
                .send(admin);

            updateUser.status.should.be.eql(404);
            updateUser.body.should.have.property('message')
                .eql('No valid entry found with provided id .');
        });

        xit('it should NOT PATCH a user with a missing or invalid JWT', async () => {

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

        xit("it should check that a student can't update another student's profile", async () => {

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

    });

    /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id user', () => {

        it('it should DELETE a user by id', async () => {

            const randomUser = Math.random().toString(36).substr(2, 6);

            const newUser = {
                "username": randomUser,
                "email": `${randomUser}@gmail.com`,
                "password": randomUser
            };

            const createdUser = await chai.request(server)
                .post('/server/api/signup')
                .send(newUser);

            const deletedUser = await chai.request(server)
                .delete(`/server/api/user/${createdUser.body.user.userId}`)
                .set('Authorization', loginUser.body.token);

            deletedUser.status.should.be.eql(200);
            expect(deletedUser.body.removedUser.username).to.equal(newUser.username);
            deletedUser.body.should.have.property('message')
                .eql('User deleted successfully !');

        });

        it('it should NOT DELETE a user by a wrong id', async () => {

            const deletedUser = await chai.request(server)
                .delete(`/server/api/user/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedUser.status.should.be.eql(404);
            deletedUser.body.should.have.property('message')
                .eql('No valid entry found with provided id');

        });

        xit('it should NOT DELETE a user with a missing or invalid JWT', (done) => {

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

        xit("it should check that a student can't delete another student's profile", (done) => {

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

    /*
     * Test the /PATCH/:id/score route
     */
    describe('/PATCH/:id/score', () => {

        it("it should PATCH the user's score ", async () => {

            const adminScore = await chai.request(server)
                .patch(`/server/api/user/${env.ADMIN_ID}/score`)
                .send({ "score" : 10})
                .set('Authorization', loginUser.body.token);

            adminScore.status.should.be.eql(200);
            expect(adminScore.body.updatedUser.score).to.equal(10);
            expect(adminScore.body.updatedUser.level).to.equal('C2');
            adminScore.body.should.have.property('message')
                .eql('User info updated successfully !');

        });

    });

});
