import {
    addUser
} from '../../use-cases/users'

import makePostUser from './post-user'

const postUser = makePostUser({ addUser });

const userController = Object.freeze({
    postUser
});

export default userController
export { postUser }
