export default function makeGetOneUser ({ usersDb }) {
    return async function GetOneUser ({id}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }
        const t = await usersDb.findById({ id });
        console.log(t);
        return usersDb.findById({ id });
    }
}
