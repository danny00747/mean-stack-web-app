export default function makeLogInUserService({userRepository}) {
    return async (userInfo) => {

        if (!userInfo.pseudo) throw new Error('You must supply a pseudo.');
        if (!userInfo.password) throw new Error('You must supply a password.');

        return userRepository.findPseudo(userInfo.pseudo);

    }
}
