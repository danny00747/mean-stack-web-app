export default function makeRemoveQuestionService({questionRepository}) {
    return async ({id} = {}) => {

        if (!id) throw new Error('You must supply the question id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        return questionRepository.remove({id: id});

    }
}
