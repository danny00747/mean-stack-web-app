export default function makeGetOneQuestion ({ questionsDb }) {
    return async function GetOneQuestion ({id}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }
        return questionsDb.findById({ id });
    }
}
