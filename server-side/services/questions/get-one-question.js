export default function makeGetOneQuestionService({questionRepository}) {
    return async ({id}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        return questionRepository.findById({id});
    }
}
