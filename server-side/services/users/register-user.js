import {makeUser} from '../../domain'
export default function makeAdduserService({userRepository}) {
    return async function addUserService(userInfo) {

        const user = makeUser(userInfo);

        const existing = await userRepository.findByEmailOrUsername(userInfo.email, userInfo.username);

        if (existing.length !== 0) return {message: "A user with the same username or email already exists !"};

        return userRepository.save({
            username: user.getUsername(),
            email: user.getEmail(),
            password: user.getPassword(),
            reviews: user.getReviews(),
            role: user.getRole(),
            score: user.getScore(),
        })
    }
}
