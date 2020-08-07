import {jwtFactory, passwordFactory, randomKeyFactory} from "../security";
import {makeUser} from '../domain'

export default function userServiceFactory({userRepository, tokenRepository}) {
    return Object.freeze({
        logInUser, addUser, editUser, listUsers, removeUser,
        getUser, editScore, resendEmail, verifyUser
    });

    async function logInUser({pseudo, password} = {}) {

        if (!pseudo) return {message: 'You must supply a pseudo.'};
        if (!password) return {message: 'You must supply a password.'};

        const existing = await userRepository.findPseudo({pseudo});

        if (!existing) return {message: "Authentication failed !"};

        const {email: userEmail, _id: id, password: userPassword} = existing;

        const validPassword = await passwordFactory.verifyPassword(password, userPassword);

        if (!validPassword) return {message: "Authentication failed !"};

        if (validPassword && !existing.isVerified) return {isVerified: false};

        if (validPassword && existing.isVerified)
            return {token: jwtFactory.generateJwt({userEmail, id}), existing};
    }

    async function addUser(userInfo) {

        const existing = await userRepository.findByEmailOrUsername({...userInfo});

        if (existing.length !== 0) return {message: "A user with the same username or email already exists !"};

        const user = makeUser({...userInfo});

        const createdUser = await userRepository.save({
            username: user.getUsername(),
            email: user.getEmail(),
            password: user.getPassword(),
            reviews: user.getReviews(),
            role: user.getRole(),
            score: user.getScore(),
            isVerified: user.getVerifiedStatus(),
            createdOn: user.getcreatedOn(),
        });

        const key = await tokenRepository.save({
            userId: createdUser._id,
            randomKey: randomKeyFactory.generateKey()
        });

        return {createdUser, key};

    }

    async function editUser({id, ...changes} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        const findUser = await userRepository.findById({id});

        if (!findUser) return {message: "No valid entry found with provided id ."};

        const existing = await userRepository.findByEmailOrUsername({...changes});

        if (existing.length !== 0 && id !== (existing[0]._id).toString())
            return {message: "A user with the same username or email already exists !"};

        const user = makeUser({...changes});

        if (findUser.reviews.length !== 0)
            findUser.reviews.forEach(x => x["author"] = user.getUsername());

        return userRepository.patch({
            id: id,
            username: user.getUsername(),
            email: user.getEmail(),
            password: user.getPassword(),
            reviews: findUser.reviews
        });

    }

    async function listUsers() {
        return userRepository.findAll();
    }

    async function removeUser({id} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        return userRepository.remove({id});
    }

    async function getUser({id} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        return userRepository.findById({id});

    }

    async function editScore({id, ...changes} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        if (!changes.score) return {message: 'You must supply a score.'};

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

    async function resendEmail({email} = {}) {

        if (!email) return {message: 'You must supply the user email.'};

        if (!(email.match(/^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\.[aA-zZ]{2,4}$/)))
            return {message: `${email} is not a valid email`};

        const findUser = await userRepository.findByEmail({email});

        if (!findUser) return {message: "No user was found with provided email"};

        if (findUser.isVerified)
            return {message: "This account has already been verified. Please log in."};

        const key = await tokenRepository.save({
            userId: findUser._id,
            randomKey: randomKeyFactory.generateKey()
        });

        return {findUser, key};

    }

    async function verifyUser({key} = {}) {

        if (!key) return {message: 'You must supply the key.'};

        if (key.length !== 64) return {message: 'Invalid key'};

        const findTheKey = await tokenRepository.findKey({key});

        if (!findTheKey) return {message: "the key has expired."};

        return userRepository.patch({
            id: findTheKey.userId,
            isVerified: true
        });

    }

}
