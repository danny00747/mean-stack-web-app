import {makeUser} from '../../domain'

export default function makeAdduserService({userRepository, tokenRepository, crypto}) {

    return async (userInfo) => {

        const user = makeUser({...userInfo});

        const existing = await userRepository.findByEmailOrUsername({...userInfo});

        if (existing.length !== 0) return {message: "A user with the same username or email already exists !"};

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
            randomKey: crypto.randomBytes(32).toString('hex')
        });

        return {createdUser, key};
    }
}
