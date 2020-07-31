import {makeQuestion} from '../domain'

export default function questionServiceFactory({questionRepository}) {
    return Object.freeze({
        addQuestion, editQuestion, listQuestions, getQuestion, removeQuestion
    });

    async function addQuestion(questionInfo) {
        const question = makeQuestion({...questionInfo});
        return questionRepository.save({
            type: question.getType(),
            question: question.getQuestion(),
            answers: question.getAnswers(),
        })
    }

    async function editQuestion({id, ...changes} = {}) {

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

    async function listQuestions() {
        return questionRepository.findAll();
    }

    async function getQuestion({id}) {
        
        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        return questionRepository.findById({id});
    }
    
    async function removeQuestion({id}) {

        if (!id) throw new Error('You must supply the question id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        return questionRepository.remove({id: id});
    }
};
