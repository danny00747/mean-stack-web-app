    export default function buildMakeQuestion() {
    return function makeQuestion({type, question, answers} = {}) {

        if (!type) {
            throw new Error('A question must have a type.')
        }
        if (typeof type !== 'string') {
            throw new Error('The type must be a string.')
        }
        if (!question) {
            throw new Error('The question field is required.')
        }
        if (typeof question !== 'string') {
            throw new Error('A question must be a string required.')
        }
        if (!answers) {
            throw new Error('A question must have answers.');
        }

        const typeEnum = {MULTIPLE :"multiple", BOOLEAN :"boolean", FILLIN :"fill in"};
        Object.freeze(typeEnum);

        if (type !== typeEnum.BOOLEAN && type !== typeEnum.MULTIPLE &&
            type !== typeEnum.FILLIN) {
            throw new Error('These are the types are allowed : boolean, multiple, fill in');
        }

        answers.forEach(x => {
           if (x.option === undefined) throw new Error('Each answer must have an option');
           if (x.isCorrect === undefined) throw new Error('Each answer must have the isCorrect field');
           if (Object.keys(x).length > 2) throw new Error('Some fields are not allowed !');
        });

        return Object.freeze({
            getType: () => typeEnum[Object.keys(typeEnum)
                .find(x => typeEnum[x] === type)],
            getQuestion: () => question,
            getAnswers: () => answers
        });

    }
}
