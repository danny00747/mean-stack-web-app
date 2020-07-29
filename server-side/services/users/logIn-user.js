import {passwordFactory, jwtFactory} from '../../security'

export default function makeLogInUserService({userRepository}) {
    return async ({pseudo, password} = {}) => {

        if (!pseudo) return {message: 'You must supply a pseudo.'};
        if (!password) return {message: 'You must supply a password.'};

        const existing = await userRepository.findPseudo({pseudo});

        if (!existing) return {message: "Authentication failed !"};

        const {email: userEmail, _id: id, password: userPassword} = existing;

        const validPassword = await passwordFactory.verifyPassword(password, userPassword);

        if (validPassword && !existing.isVerified) return {isVerified: false};

        if (validPassword && existing.isVerified) {

            const jwtToken = jwtFactory.generateJwt({userEmail, id});
            return {token: jwtToken, existing};
        }

        return {message: "Authentication failed !"};

    }
}
