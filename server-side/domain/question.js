export default function buildMakeQuestion(requiredParameter) {
    return ({type = requiredParameter('A type'),
                question = requiredParameter('A question'),
                answers = requiredParameter("The question's answer")} = {}) => {

        if (typeof type !== 'string') throw new TypeError('The type must be a string.');

        if (typeof question !== 'string') throw new TypeError('A question must be a string required.');

        const typeEnum = {MULTIPLE: "multiple", BOOLEAN: "boolean", FILLIN: "fill in"};
        Object.freeze(typeEnum);

        if (type !== typeEnum.BOOLEAN && type !== typeEnum.MULTIPLE &&
            type !== typeEnum.FILLIN) {
            throw new RangeError('These are the types are allowed : boolean, multiple, fill in');
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
