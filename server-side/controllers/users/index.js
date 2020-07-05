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

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const postUserController = makePostUserController({addUserService});
const loggedInUserController = makeSignInUserController({logInUserService, bcrypt, jwt});
const getUsersController = makeGetUsersController({getAllUsersService});
const getUserController = makeGetOneUserController({getOneUserService});
const patchUserController = makePatchUserController({editUserService});
const deleteUserController = makeDeleteUserController({removeUserService});
const patchScoreController = makePatchScoreController({editScoreService});

const userController = Object.freeze({
    postUserController, loggedInUserController, getUsersController,
    getUserController, patchUserController, deleteUserController, patchScoreController
});

export default userController
export {
    postUserController, loggedInUserController, getUsersController,
    getUserController, patchUserController, deleteUserController, patchScoreController
}
