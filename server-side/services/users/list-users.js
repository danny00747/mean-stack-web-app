export default function makeListUsersService({userRepository}) {
    return async function listUsersService() {
        return userRepository.findAll();
    }
}
