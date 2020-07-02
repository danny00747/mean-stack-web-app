import makeQuestion from '../domain'
export default function makeEditQuestion ({questionsDb}) {
    return async function editQuestion ({ id, ...changes } = {}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        const existing = await questionsDb.findById({id});

        const question = makeQuestion({ ...existing, ...changes });

        return questionsDb.patch({
            id: id,
            type: question.getType(),
            question: question.getQuestion(),
            answers: question.getAnswers(),
        });

    }
}
