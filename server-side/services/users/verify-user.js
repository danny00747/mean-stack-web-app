export default function makeVerifyUserService({userRepository, tokenRepository}) {
    return async ({key} = {}) => {

        if (!key) throw new Error('You must supply the key.');

        const findTheKey = await tokenRepository.findKey({key});

       if (!findTheKey) return {message: "the key has expired."};

        return userRepository.patch({
            id: findTheKey.userId,
            isVerified: true,
        });
    }
}
