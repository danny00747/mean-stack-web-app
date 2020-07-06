export default function makeListUsersService({userRepository}) {
    return async () => {
        return userRepository.findAll();
    }
}
