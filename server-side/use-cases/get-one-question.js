
export default function makeGetOneQuestion ({ questionsDb }) {
    return async function GetOneQuestion ({id}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        return questionsDb.findById({ id });


    }
}
