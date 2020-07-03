import makeAdduser from './add-user'
import {usersDb} from '../../data-access/index'

const addUser = makeAdduser({usersDb});

const userService = Object.freeze({
    addUser
});

export default userService
export {addUser}
