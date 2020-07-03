import makeAdduser from './register-user'
import makeLogInUser from './logIn-user'
import makeListUsers from './list-users'
import makeGetOneUser from './get-one-user'

import {usersDb} from '../../data-access/index'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const addUser = makeAdduser({usersDb, bcrypt});
const logInUser = makeLogInUser({usersDb, bcrypt, jwt});
const getAllUsers = makeListUsers({usersDb});
const getOneUser = makeGetOneUser({usersDb});

const userService = Object.freeze({
    addUser, logInUser, getAllUsers, getOneUser
});

export default userService
export {addUser, logInUser, getAllUsers, getOneUser}
