import {makeUser} from '../../domain'

export default function makeEditUserService({userRepository}) {
    return async ({id, ...changes} = {}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        const user = makeUser({...changes});

        const findUser = await userRepository.findById({id});

        if (!findUser) return {message: "No valid entry found with provided id ."};

        const existing = await userRepository.findByEmailOrUsername({...changes});

        if (existing.length !== 0 && id !== (existing[0]._id).toString())
            return {message: "A user with the same username or email already exists !"};

        if (findUser.reviews.length !== 0)
            findUser.reviews.forEach(x => x["author"] = user.getEmail());

        return userRepository.patch({
            id: id,
            username: user.getUsername(),
            email: user.getEmail(),
            password: user.getPassword(),
            reviews: findUser.reviews
        });
    }
}
