    export default function buildMakeQuestion() {
    return function makeQuestion({type, question, answers} = {}) {

        if (!type ) {
            throw new Error('A question must have a type.')
        }
        if (typeof type !== 'string') {
            throw new Error('The type must be a string.')
        }
        if (!question) {
            throw new Error('The question field is required.')
        }
        if (!answers) {
            throw new Error('A question must have answers.');
        }
        return Object.freeze({
            getType: () => type,
            getQuestion: () => question,
            getAnswers: () => answers,
        });
    }
}
