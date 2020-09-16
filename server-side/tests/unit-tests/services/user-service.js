//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//import server to bring in everything together
import server from "../../../../app";

//bring in dev-dependencies
import {expect} from 'chai';
import {describe, it} from 'mocha';

import makeFakeUser from '../../fixtures/fakeUser'
import env from '../../../config/environment'
import {userService} from "../../../services"
import {userRepository} from '../../../repository'


//TODO test can login function

describe('USER SERVICE', () => {

    describe('#register-user', () => {

        it('inserts a user in the database', async () => {

            const {...newUser} = makeFakeUser();

            const inserted = await userService.addUser({...newUser});
            newUser.password = inserted.createdUser.password;
            newUser.id = inserted.createdUser.id;
            expect(inserted.createdUser).to.deep.include(newUser);

            await userRepository.remove({id: inserted.createdUser._id});
        });

        it("can't register a user if he/she already exists", async () => {

            const {...newUser} = makeFakeUser({username: env.ADMIN_PSEUDO});
            const inserted = await userService.addUser({...newUser});
            expect(inserted.message)
                .to.equal("A user with the same username or email already exists !");
        });
    });

    describe('#login-user', () => {

        it("can authenticate a user", async () => {

            const {...newUser} = makeFakeUser();

            const inserted = await userService.addUser({...newUser});

            await userRepository.patch({
                id: inserted.createdUser._id,
                isVerified: true
            });

            const logInUser = await userService.logInUser(
                {pseudo: newUser.username, password: newUser.password});

            expect(logInUser).to.have.property('token');
            expect(logInUser).to.have.property('existing');
            expect(logInUser.existing.username).to.equal(newUser.username);

            await userRepository.remove({id: inserted.createdUser._id});
        });

        it("must include an pseudo", async () => {
            const logInUser = await userService.logInUser(
                {pseudo: undefined, password: "123"});
            expect(logInUser.message).to.equal("You must supply a pseudo.");

        });

        it("must include an password", async () => {
            const logInUser = await userService.logInUser(
                {pseudo: "123", password: undefined});
            expect(logInUser.message).to.equal("You must supply a password.");

        });

        it("can't authenticate unregistered user", async () => {
            const logInUser = await userService.logInUser(
                {pseudo: '*******', password: '*******'});
            expect(logInUser.message).to.equal("Authentication failed !");

        });

        it("can't authenticate a user with a wrong password user", async () => {
            const logInUser = await userService.logInUser(
                {pseudo: env.ADMIN_PSEUDO, password: '*******'});
            expect(logInUser.message).to.equal("Authentication failed !");

        });

        it("can't authenticate an unverified user", async () => {

            const {...newUser} = makeFakeUser();

            const inserted = await userService.addUser({...newUser});

            const logInUser = await userService.logInUser(
                {pseudo: newUser.username, password: newUser.password});
            expect(logInUser.isVerified).to.equal(false);

            await userRepository.remove({id: inserted.createdUser._id});

        });
    });

    describe('#edit-user', () => {

        it("must include an id", async () => {
            const editUser =
                await userService.editUser({id: undefined, ...makeFakeUser()});
            expect(editUser.message)
                .to.equal("You must supply an id.");

        });

        it("must have valid id", async () => {
            const editUser =
                await userService.editUser({id: "123", ...makeFakeUser()});
            expect(editUser.message)
                .to.equal("123 is not a valid ObjectId");

        });

        it("can edit user", async () => {
            const userToEdit = makeFakeUser({
                username: env.ADMIN_PSEUDO,
                email: env.ADMIN_EMAIL,
                password: env.ADMIN_PSD
            });
            const editUser =
                await userService.editUser({id: env.ADMIN_ID, ...userToEdit});
            expect(editUser.username).to.equal(env.ADMIN_PSEUDO);

        });

        it("can't edit user with wrong id", async () => {
            const editUser = await userService.editUser(
                {id: "0a9da315a602ac4e7c1bd008", ...makeFakeUser()});
            expect(editUser.message)
                .to.equal("No valid entry found with provided id .");

        });

        it("can't edit user with an already taken username or email", async () => {

            const {...newUser} = makeFakeUser();

            const inserted = await userService.addUser({...newUser});

            await userRepository.patch({
                id: inserted.createdUser._id,
                isVerified: true
            });

            newUser.username = env.ADMIN_PSEUDO;

            const editedUser = await userService.editUser(
                {id: `${inserted.createdUser._id}`, ...newUser});
            expect(editedUser.message)
                .to.equal("A user with the same username or email already exists !");

            await userRepository.remove({id: inserted.createdUser._id});
        });
    });

    describe('#list-users', () => {

        it("can list all users", async () => {
            const users = await userService.listUsers();
            expect(users).to.be.an('array');
            expect(users).to.have.lengthOf.above(0);
            expect(users).to.not.have.members([{password: "123"}]);
        });
    });

    describe('#get-user', () => {

        it("can list all users", async () => {
            const user = await userService.getUser({id : env.ADMIN_ID});
            expect(user).to.have.property('username');
            expect(user).to.have.property('email');
        });

        it("must include an id", async () => {

            const deletedUser = await userService.getUser({id: undefined});

            expect(deletedUser.message).to.equal("You must supply an id.");
        });

        it("must have valid id", async () => {

            const editUser = await userService.getUser({id: "123"});

            expect(editUser.message).to.equal("123 is not a valid ObjectId");
        });
    });

    describe('#remove-user', () => {

        it("must include an id", async () => {

            const deletedUser = await userService.removeUser({id: undefined});

            expect(deletedUser.message).to.equal("You must supply an id.");
        });

        it("must have valid id", async () => {

            const editUser = await userService.removeUser({id: "123"});

            expect(editUser.message).to.equal("123 is not a valid ObjectId");
        });

        it("can delete a user", async () => {

            const userToDelete = await userService.addUser({...makeFakeUser()});

            const userId = (userToDelete.createdUser._id).toString();

            const deletedUser = await userService.removeUser({id: userId});

            expect((deletedUser._id).toString()).to.equal(userId);
            expect(deletedUser).to.be.an('object');
            expect(deletedUser).to.have.property('username');
        });
    });

    describe('#edit-score', () => {

        it("must include an id", async () => {

            const editUser = await userService.editScore(
                {id: undefined, score: 4});

            expect(editUser.message).to.equal("You must supply an id.");
        });

        it("must have valid id", async () => {

            const editUser = await userService.editScore({id: "123", score: 4});

            expect(editUser.message).to.equal("123 is not a valid ObjectId");
        });

        it("must include the score", async () => {

            const editUser = await userService.editScore(
                {id: env.ADMIN_ID, score: undefined});

            expect(editUser.message).to.equal("You must supply a score.");
        });

        it("can edit the user's score", async () => {

            const editUser = await userService.editScore(
                {id: env.ADMIN_ID, score: 8});

            expect(editUser).to.be.an('object');
            expect(editUser).to.have.property('score').that.eqls(8);
            expect(editUser).to.have.property('level').that.eqls('C1');

        });
    });

    describe('#resend-email', () => {

        it("must include an email", async () => {

            const editUser = await userService.resendEmail({email: undefined});

            expect(editUser.message).to.equal("You must supply the user email.");
        });

        it("must have valid email", async () => {

            const sendEmail = await userService.resendEmail({email: 'totogmail.com'});

            expect(sendEmail.message).to.equal("totogmail.com is not a valid email");
        });

        it("can resend an email", async () => {

            const userToSendEmailTo = await userService.addUser({...makeFakeUser()});

            const sendEmail =
                await userService.resendEmail({email: userToSendEmailTo.createdUser.email});

            expect(sendEmail.findUser).to.have.property('isVerified').that.eqls(false);
            expect(sendEmail.key).to.have.property('randomKey');

            expect(sendEmail.key.randomKey).to.have.lengthOf(64);

            expect(Object.keys(sendEmail)).to.have.lengthOf(2);

            await userRepository.remove({id: userToSendEmailTo.createdUser._id});

        });

        it("can't send an email to a verified user", async () => {

            const sendEmail = await userService.resendEmail({email: env.ADMIN_EMAIL});

            expect(sendEmail.message)
                .to.equal("This account has already been verified. Please log in.");
        });

        it("can't send an email to a unregistered user", async () => {

            const {...randomUser} = makeFakeUser();

            const sendEmail = await userService.resendEmail({email: randomUser.email});

            expect(sendEmail.message).to.equal('No user was found with provided email');

        });

    });

    describe('#verify-user', () => {

        it("can verify a user", async () => {

            const userToVerify = await userService.addUser({...makeFakeUser()});

            const verifiedUser = await userService.verifyUser({key: userToVerify.key.randomKey});

            expect(verifiedUser).to.have.property('isVerified').that.eqls(true);

            await userRepository.remove({id: userToVerify.createdUser._id});
        });

        it("must include an key", async () => {

            const editUser = await userService.verifyUser({key: undefined});

            expect(editUser.message).to.equal("You must supply the key.");
        });

        it("must have a valid key", async () => {

            const sendEmail = await userService.verifyUser({key: 'abc'});

            expect(sendEmail.message).to.equal("Invalid key");
        });

        it("the key has expired", async () => {

            const sendEmail = await userService.verifyUser({key: 'a'.repeat(64)});

            expect(sendEmail.message).to.equal("the key has expired.");
        });

    });
});
