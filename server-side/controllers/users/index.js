import makePostUserController from './post-user'
import makeSignInUserController from './logIn-user'
import makeGetUsersController from './get-users'
import makeGetOneUserController from './get-one-user'
import makePatchUserController from './edit-user'
import makeDeleteUserController from './remove-user'
import makePatchScoreController from './edit-score'
import makeVerifyUserController from './verify-user'
import makeResendEmailController from './resend-email'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const postUserController = makePostUserController();
const verifyUserController = makeVerifyUserController();
const resendEmailController = makeResendEmailController();
const loggedInUserController = makeSignInUserController({bcrypt, jwt});
const getUsersController = makeGetUsersController();
const getUserController = makeGetOneUserController();
const patchUserController = makePatchUserController();
const deleteUserController = makeDeleteUserController();
const patchScoreController = makePatchScoreController();

const userController = Object.freeze({
    postUserController, loggedInUserController, getUsersController,
    verifyUserController, getUserController, patchUserController,
    deleteUserController, patchScoreController, resendEmailController
});

export default userController
export {
    postUserController, loggedInUserController, getUsersController,
    verifyUserController, resendEmailController, getUserController,
    patchUserController, deleteUserController, patchScoreController
}
