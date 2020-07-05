export default function makeRemoveUserService({userRepository}) {
    return async function removeUserService({id} = {}) {
        if (!id) {
            throw new Error('You must supply the question id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }

        return userRepository.remove({id : id});

    }
}
