import {makeUser} from '../../domain';

export default function makeVerifyUserService({userRepository, tokenRepository}) {
    return async ({key} = {}) => {

        if (key.length !== 64) throw new Error('Invalid key .');

        const findTheKey = await tokenRepository.findKey({key});

       if (!findTheKey) return {message: "The key has expired !"};

        return userRepository.patch({
            id: findTheKey.userId,
            isVerified: true,
        });
    }
}
