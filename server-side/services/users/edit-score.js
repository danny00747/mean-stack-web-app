import {makeUser} from '../../domain'
export default function makeEditScoreService({userRepository}) {
    return async  ({id, ...changes} = {}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        const existing = await userRepository.findById({id});

        if (!existing) return {message: "No valid entry found with provided id !"};

        const {username, email, password} = existing;

        changes.username = username;
        changes.email = email;
        changes.password = password;

        const user = makeUser({...changes});

        return userRepository.patch({
            id: id,
            score: user.getScore(),
            level: user.getLevel()
        });
    }
}
