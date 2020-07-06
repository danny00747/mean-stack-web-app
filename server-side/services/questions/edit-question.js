import {makeQuestion} from '../../domain'
export default function makeEditQuestionService({questionRepository}) {
    return async ({id, ...changes} = {}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        const question = makeQuestion({...changes});

        return questionRepository.patch({
            id: id,
            type: question.getType(),
            question: question.getQuestion(),
            answers: question.getAnswers(),
        });
    }
}
