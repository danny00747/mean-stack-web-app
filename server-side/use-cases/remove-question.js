export default function makeRemoveQuestion({questionsDb}) {
    return async function removeQuestion({id} = {}) {
        if (!id) {
            throw new Error('You must supply the question id.')
        }

        return questionsDb.remove({id : id});

    }
}
