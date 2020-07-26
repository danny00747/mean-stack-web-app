//During the test the env variable is set to test
import server from "../../../../app";

process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import chai, {assert, should, expect} from 'chai';
import {describe, before, it} from 'mocha';


import makeFakeUser from '../../fixtures/fakeUser'
import {makeUser} from '../../../domain'
import env from '../../../config/environment'
import makeAdduserService from '../../../services/users/register-user'
import {addUserService} from '../../../services/users'
import {User} from '../../../models/users'
import {Token} from '../../../models/users'
import crypto from "crypto";
import makeUserRepository from "../../../repository/userRepository";
import makeTokenRepository from "../../../repository/tokenRepository";

describe('USER SERVICE', () => {

    let userRepository = "";
    let tokenRepository = "";

    before(async () => {

        // userRepository = makeUserRepository({User});
        // tokenRepository = makeTokenRepository({Token});
    });

    describe('#post-user', () => {

        it('inserts a user in the database', async () => {

            const {...newUser} = makeFakeUser();
            // const adduser = makeAdduserService({userRepository, tokenRepository, crypto});
            const inserted = await addUserService({...newUser});
            newUser.password = inserted.createdUser.password;
            expect(inserted.createdUser).to.deep.include(newUser);
            //expect({a: 1, b: 2, c: 3}).to.deep.include({a: 1, b: 2});
            //expect({a: 1, b: 2, c: 3}).to.include({a: 1, b: 2});

            //  await User.findByIdAndRemove({_id: inserted.createdUser._id}).exec();
        })
    });
});
