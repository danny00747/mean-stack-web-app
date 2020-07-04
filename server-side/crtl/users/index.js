import {
    addUser, logInUser, getAllUsers, getOneUser, editUser, removeUser, editScore
} from '../../use-cases/users'

import makePostUser from './post-user'
import makeSignInUser from './logIn-user'
import makeGetUsers from './get-users'
import makeGetOneUser from './get-one-user'
import makePatchUser from './edit-user'
import makeDeleteUser from './remove-user'
import makePatchScore from './edit-score'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const postUser = makePostUser({ addUser });
const loggedInUser = makeSignInUser({ logInUser, bcrypt, jwt });
const getUsers = makeGetUsers({ getAllUsers });
const getUser = makeGetOneUser({ getOneUser });
const patchUser = makePatchUser({ editUser });
const deleteUser = makeDeleteUser({ removeUser });
const patchScore = makePatchScore({ editScore });

const userController = Object.freeze({
    postUser, loggedInUser, getUsers, getUser, patchUser, deleteUser, patchScore
});

export default userController
export { postUser, loggedInUser, getUsers, getUser, patchUser, deleteUser, patchScore}
