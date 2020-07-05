export default function makeLogInUserService({userRepository}) {
    return async function logInUserService(userInfo) {
        return userRepository.findPseudo(userInfo.pseudo);

    }
}
