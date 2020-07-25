export default function makeResendEmailService({userRepository, tokenRepository ,crypto}) {
    return async ({email} = {}) => {

        if (!email) throw new Error('You must supply the user email.');

        if (!(email.match(/^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\.[aA-zZ]{2,4}$/)))
            throw new SyntaxError(`${email} is not a valid email`);

        const findUser = await userRepository.findByEmail({email});

        if (!findUser) return {message: "No user was found with provided email"};

        if (findUser.isVerified)
            return {message: "This account has already been verified. Please log in."};

        const key = await tokenRepository.save({
            userId: findUser._id,
            randomKey: crypto.randomBytes(32).toString('hex')
        });


        return {findUser, key};
    }
}
