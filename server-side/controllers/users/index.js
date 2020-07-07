import {
    addUserService, logInUserService, getAllUsersService,
    getOneUserService, editUserService, removeUserService, editScoreService
} from '../../services/users'

import makePostUserController from './post-user'
import makeSignInUserController from './logIn-user'
import makeGetUsersController from './get-users'
import makeGetOneUserController from './get-one-user'
import makePatchUserController from './edit-user'
import makeDeleteUserController from './remove-user'
import makePatchScoreController from './edit-score'

import {addLogService} from '../../services/logs'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const postUserController = makePostUserController({addUserService, addLogService});
const loggedInUserController = makeSignInUserController({logInUserService, bcrypt, jwt, addLogService});
const getUsersController = makeGetUsersController({getAllUsersService, addLogService});
const getUserController = makeGetOneUserController({getOneUserService, addLogService});
const patchUserController = makePatchUserController({editUserService, addLogService});
const deleteUserController = makeDeleteUserController({removeUserService, addLogService});
const patchScoreController = makePatchScoreController({editScoreService, addLogService});

const userController = Object.freeze({
    postUserController, loggedInUserController, getUsersController,
    getUserController, patchUserController, deleteUserController, patchScoreController
});

export default userController
export {
    postUserController, loggedInUserController, getUsersController,
    getUserController, patchUserController, deleteUserController, patchScoreController
}
