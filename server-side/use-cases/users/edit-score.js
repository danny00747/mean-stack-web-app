import {makeUser} from '../../domain'

export default function makeEditScore({usersDb}) {
    return async function editScore({id, ...changes} = {}) {

        if (!id) {
            throw new Error('You must supply an id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }

        const existing = await usersDb.findById({id});

        const {username, email, password} = existing;

        changes.username = username;
        changes.email = email;
        changes.password = password;

        const user = makeUser({...changes});

        return usersDb.patch({
            id: id,
            score: user.getScore(),
            level: user.getLevel()
        });

        //const updatedUser = await usersDb.findById({id});

    }
}
