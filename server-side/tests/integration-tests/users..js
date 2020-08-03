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
import {userRepository} from '../../repository'
import makeTwoUsers from "../fixtures/make2users";
import usersRbac from "../fixtures/rbacTestWith2users";

chai.use(chaiHttp);


describe('Users', () => {

    let loginUser = "";

    const user = {
        "pseudo": env.ADMIN_PSEUDO,
        "password": env.ADMIN_PSD,
    };

    const admin = {
        "username": env.ADMIN_PSEUDO,
        "email": env.ADMIN_EMAIL,
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

            const newUser = makeTwoUsers().user1;

            const createdUser = await chai.request(server)
                .post('/server/api/signup')
                .send(newUser);

            createdUser.status.should.be.eql(201);
            createdUser.body.should.have.property('message')
                .eql(`A verification email has been sent to ${newUser.email}`);
            expect(createdUser.body.success).to.be.true;

            await userRepository.remove({id: createdUser.body.user.userId});

        });

        it('it should NOT create a user if he/she already exists', async () => {

            const newUser = {
                "username": env.ADMIN_PSEUDO,
                "email": `abc@gmail.com`,
                "password": 'abc'
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
     * Test the /Get all users route
     */
    describe('/GET users', () => {

        it('it should GET all users', async () => {

            const users = await chai.request(server)
                .get('/server/api/users/profiles')
                .set('Authorization', loginUser.body.token);

            users.status.should.be.eql(200);
            users.body.should.be.an('array');

        });

        it('it should NOT GET all user with a missing or invalid JWT', async () => {

            const users = await chai.request(server)
                .get('/server/api/users/profiles');

            const users1 = await chai.request(server)
                .get('/server/api/users/profiles')
                .set('Authorization', "abc");

            users.status.should.be.eql(401);
            users1.status.should.be.eql(401);
            users.body.should.be.empty;
            users1.body.should.be.empty;

        });

        it('it should NOT GET all users if the request is sent by a student', async () => {

            const rbac = await usersRbac();

            const getUsers = await chai.request(server)
                .get('/server/api/users/profiles')
                .set('Authorization', rbac.logInUser1.token);

            getUsers.status.should.be.eql(403);
            getUsers.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action`);

            await userRepository.remove({id: rbac.createdUser1.createdUser._id});
            await userRepository.remove({id: rbac.createdUser2.createdUser._id});
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

        it('it should NOT GET a user with a missing or invalid JWT', async () => {

            const users = await chai.request(server)
                .get('/server/api/user/1f468dbf5182002118fc8821');

            const users1 = await chai.request(server)
                .get('/server/api/user/1f468dbf5182002118fc8821')
                .set('Authorization', "abc");

            users.status.should.be.eql(401);
            users1.status.should.be.eql(401);
            users.body.should.be.empty;
        });

        it("it should check that a student can't get/see another student's profile", async () => {

            const rbac = await usersRbac();

            const getProfile = await chai.request(server)
                .get(`/server/api/user/${rbac.createdUser2.createdUser._id}`)
                .set('Authorization', rbac.logInUser1.token);

            getProfile.status.should.be.eql(403);
            getProfile.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id: rbac.createdUser1.createdUser._id});
            await userRepository.remove({id: rbac.createdUser2.createdUser._id});
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

        it('it should NOT PATCH a user with a missing or invalid JWT', async () => {

            const users = await chai.request(server)
                .patch('/server/api/user/1f468dbf5182002118fc8821');

            const users1 = await chai.request(server)
                .patch('/server/api/user/1f468dbf5182002118fc8821')
                .set('Authorization', "abc");

            users.status.should.be.eql(401);
            users1.status.should.be.eql(401);
            users.body.should.be.empty;
        });

        it("it should check that a student can't update another student's profile", async () => {

            const rbac = await usersRbac();

            const updateProfile = await chai.request(server)
                .patch(`/server/api/user/${rbac.createdUser2.createdUser._id}`)
                .set('Authorization', rbac.logInUser1.token)
                .send({"username": "abc"});

            updateProfile.status.should.be.eql(403);
            updateProfile.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id: rbac.createdUser1.createdUser._id});
            await userRepository.remove({id: rbac.createdUser2.createdUser._id});
        });

    });

    /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id user', () => {

        it('it should DELETE a user by id', async () => {

            const newUser = makeTwoUsers().user1;

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

        it('it should NOT DELETE a user with a missing or invalid JWT', async () => {

            const users = await chai.request(server)
                .patch('/server/api/user/1f468dbf5182002118fc8821');

            const users1 = await chai.request(server)
                .patch('/server/api/user/1f468dbf5182002118fc8821')
                .set('Authorization', "abc");

            users.status.should.be.eql(401);
            users1.status.should.be.eql(401);
        });

        it("it should check that a student can't delete another student's profile", async () => {

            const rbac = await usersRbac();

            const deleteProfile = await chai.request(server)
                .delete(`/server/api/user/${rbac.createdUser2.createdUser._id}`)
                .set('Authorization', rbac.logInUser1.token);

            deleteProfile.status.should.be.eql(403);
            deleteProfile.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id: rbac.createdUser1.createdUser._id});
            await userRepository.remove({id: rbac.createdUser2.createdUser._id});
        });
    });

    /*
     * Test the /PATCH/:id/score route
     */
    describe('/PATCH/:id/score', () => {

        it("it should PATCH the user's score", async () => {

            const adminScore = await chai.request(server)
                .patch(`/server/api/user/${env.ADMIN_ID}/score`)
                .send({"score": 10})
                .set('Authorization', loginUser.body.token);

            adminScore.status.should.be.eql(200);
            expect(adminScore.body.updatedUser.score).to.equal(10);
            expect(adminScore.body.updatedUser.level).to.equal('C2');
            adminScore.body.should.have.property('message')
                .eql('User info updated successfully !');

        });

        it("it should check that a student can't update another student's score", async () => {

            const rbac = await usersRbac();

            const updateScore = await chai.request(server)
                .patch(`/server/api/user/${rbac.createdUser2.createdUser._id}/score`)
                .set('Authorization', rbac.logInUser1.token)
                .send({"score": 8});

            updateScore.status.should.be.eql(403);
            updateScore.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id: rbac.createdUser1.createdUser._id});
            await userRepository.remove({id: rbac.createdUser2.createdUser._id});
        });
    });

});
