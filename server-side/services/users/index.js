import makeAdduser from './register-user'
import makeLogInUser from './logIn-user'
import makeListUsers from './list-users'
import makeGetOneUser from './get-one-user'
import makeEditUser from './edit-user'
import makeRemoveUser from './remove-user'
import makeEditScore from './edit-score'

import {usersDb} from '../../data-access/index'

const addUser = makeAdduser({usersDb});
const logInUser = makeLogInUser({usersDb});
const getAllUsers = makeListUsers({usersDb});
const getOneUser = makeGetOneUser({usersDb});
const editUser = makeEditUser({usersDb});
const removeUser = makeRemoveUser({usersDb});
const editScore = makeEditScore({usersDb});

const userService = Object.freeze({
    addUser, logInUser, getAllUsers, getOneUser, editUser, removeUser, editScore
});

export default userService
export {addUser, logInUser, getAllUsers, getOneUser, editUser, removeUser, editScore}
