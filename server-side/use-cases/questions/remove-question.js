export default function makeRemoveQuestion({questionsDb}) {
    return async function removeQuestion({id} = {}) {
        if (!id) {
            throw new Error('You must supply the question id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }
        return questionsDb.remove({id : id});

    }
}
