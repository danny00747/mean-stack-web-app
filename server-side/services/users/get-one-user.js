export default function makeGetOneUserService({userRepository}) {
    return async ({id}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        return userRepository.findById({id});
    }
}
