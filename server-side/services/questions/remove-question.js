export default function makeRemoveQuestionService({questionRepository}) {
    return async function removeQuestionService({id} = {}) {

        if (!id) throw new Error('You must supply the question id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new Error(`${id} is not a valid ObjectId`);

        return questionRepository.remove({id : id});

    }
}
