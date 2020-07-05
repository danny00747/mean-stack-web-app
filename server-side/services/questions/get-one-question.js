export default function makeGetOneQuestionService ({ questionRepository }) {
    return async function GetOneQuestionService ({id}) {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new Error(`${id} is not a valid ObjectId`);

        return questionRepository.findById({ id });
    }
}
