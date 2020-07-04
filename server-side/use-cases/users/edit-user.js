import {makeUser} from '../../domain'

export default function makeEditUser({usersDb}) {
    return async function editUser({id, ...changes} = {}) {

        if (!id) {
            throw new Error('You must supply an id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }

        const user = makeUser({...changes});

        return usersDb.patch({
            id: id,
            username: user.getUsername(),
            email: user.getEmail(),
            password: user.getPassword()
        });

        //const updatedUser = await usersDb.findById({id});



    }
}
