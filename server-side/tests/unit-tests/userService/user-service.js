//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import chai, {assert, should, expect} from 'chai';
import {describe, before, it} from 'mocha';

import makeFakeUser from '../../fixtures/fakeUser'
import env from '../../../config/environment'
import {userService} from "../../../services";
import {User} from '../../../models/users'


describe('USER SERVICE', () => {

    describe('#post-user', () => {

        it('inserts a user in the database', async () => {

            const {...newUser} = makeFakeUser();
            const inserted = await userService.addUser({...newUser});
            newUser.password = inserted.createdUser.password;
            newUser.id = inserted.createdUser.id;
            expect(inserted.createdUser).to.deep.include(newUser);

            await User.findByIdAndRemove({_id: inserted.createdUser._id}).exec();
        });

        it("can't save a user if she/he already exists", async () => {

            const {...newUser} = makeFakeUser({username: env.ADMIN_PSEUDO});
            const inserted = await userService.addUser({...newUser});
            expect(inserted.message)
                .to.equal("A user with the same username or email already exists !");

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

        it("can't edit user with wrong id", async () => {
            const editUser = await userService.editUser(
                {id: "0a9da315a602ac4e7c1bd008", ...makeFakeUser()});
            expect(editUser.message)
                .to.equal("No valid entry found with provided id .");

        });

        it("can edit user", async () => {
            const userToEdit = makeFakeUser({
                username : env.ADMIN_PSEUDO,
                email : `${env.ADMIN_PSEUDO}@gmail.com`,
                password : env.ADMIN_PSD
            });
            const editUser =
                await userService.editUser({id: env.ADMIN_ID, ...userToEdit});
            expect(editUser.username).to.equal(env.ADMIN_PSEUDO);

        })
    });

    describe('#login-user', () => {

        it("must include an pseudo", async () => {
            const logInUser = await userService.logInUser(
                {pseudo: undefined, password : "123"});
            expect(logInUser.message)
                .to.equal("You must supply a pseudo.");

        });

        it("must include an password", async () => {
            const logInUser = await userService.logInUser(
                {pseudo: "123", password : undefined});
            expect(logInUser.message)
                .to.equal("You must supply a password.");

        });
    });
});
