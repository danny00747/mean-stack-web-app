import makeAdduserService from './register-user'
import makeLogInUserService from './logIn-user'
import makeListUsersService from './list-users'
import makeGetOneUserService from './get-one-user'
import makeEditUserService from './edit-user'
import makeRemoveUserService from './remove-user'
import makeEditScoreService from './edit-score'
import makeVerifyUserService from './verify-user'

import {userRepository, tokenRepository} from '../../repository'

import crypto from 'crypto'

const addUserService = makeAdduserService({userRepository, tokenRepository, crypto});
const verifyUserService = makeVerifyUserService({userRepository, tokenRepository});
const logInUserService = makeLogInUserService({userRepository});
const getAllUsersService = makeListUsersService({userRepository});
const getOneUserService = makeGetOneUserService({userRepository});
const editUserService = makeEditUserService({userRepository});
const removeUserService = makeRemoveUserService({userRepository});
const editScoreService = makeEditScoreService({userRepository});

const userService = Object.freeze({
    addUserService, logInUserService, getAllUsersService, verifyUserService,
    getOneUserService, editUserService, removeUserService, editScoreService
});

export default userService
export {
    addUserService, logInUserService, getAllUsersService, verifyUserService,
    getOneUserService, editUserService, removeUserService, editScoreService
}
