import {
    addUser, logInUser, getAllUsers, getOneUser
} from '../../use-cases/users'

import makePostUser from './post-user'
import makeSignInUser from './logIn-user'
import makeGetUsers from './get-users'
import makeGetOneUser from './get-one-user'

const postUser = makePostUser({ addUser });
const loggedInUser = makeSignInUser({ logInUser });
const getUsers = makeGetUsers({ getAllUsers });
const getUser = makeGetOneUser({ getOneUser });

const userController = Object.freeze({
    postUser, loggedInUser, getUsers, getUser
});

export default userController
export { postUser, loggedInUser, getUsers, getUser }
