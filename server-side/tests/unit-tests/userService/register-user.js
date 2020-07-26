//During the test the env variable is set to test
import server from "../../../../app";

process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import chai, {assert, should, expect} from 'chai';
import {describe, before, it} from 'mocha';

import makeFakeUser from '../../fixtures/fakeUser'
import env from '../../../config/environment'
import {addUserService} from '../../../services/users'
import {User} from '../../../models/users'


describe('USER SERVICE', () => {

    describe('#post-user', () => {

        it('inserts a user in the database', async () => {

            const {...newUser} = makeFakeUser();
            const inserted = await addUserService({...newUser});
            newUser.password = inserted.createdUser.password;
            expect(inserted.createdUser).to.deep.include(newUser);

            await User.findByIdAndRemove({_id: inserted.createdUser._id}).exec();
        });

        it("can't save a user if she/he already exists", async () => {

            const {...newUser} = makeFakeUser({username: env.ADMIN_PSEUDO});
            const inserted = await addUserService({...newUser});
            expect(inserted.message)
                .to.equal("A user with the same username or email already exists !");

        });

        describe('#login-user', () => {

        });
    });
});
