export default function makeLogInUserService({userRepository}) {
    return async (userInfo) => {
        return userRepository.findPseudo(userInfo.pseudo);

    }
}
