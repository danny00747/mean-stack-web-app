import {makeQuestion} from '../../domain'
export default function makeEditQuestion ({questionsDb}) {
    return async function editQuestion ({ id, ...changes } = {}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
            throw new Error(`${id} is not a valid ObjectId`);
        }

        const question = makeQuestion({ ...changes });

        return questionsDb.patch({
            id: id,
            type: question.getType(),
            question: question.getQuestion(),
            answers: question.getAnswers(),
        });

    }
}
