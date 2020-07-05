export default function makeLogInUser({usersDb}) {
    return async function logInUser(userInfo) {

        return usersDb.findPseudo(userInfo.pseudo);

    }
}
