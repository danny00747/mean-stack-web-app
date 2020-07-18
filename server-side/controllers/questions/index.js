import makePostQuestionController from './post-question'
import makeGetQuestionsController from './get-questions'
import makeGetOneQuestionController from './get-one-question'
import makePatchQuestionController from './edit-question'
import makeDeleteQuestionController from './remove-question'

const postQuestionController = makePostQuestionController();
const getQuestionsController = makeGetQuestionsController();
const getQuestionController = makeGetOneQuestionController();
const patchQuestionController = makePatchQuestionController();
const deleteQuestionController = makeDeleteQuestionController();

const questionController = Object.freeze({
    postQuestionController, getQuestionsController,
    getQuestionController, patchQuestionController,
    deleteQuestionController
});

export default questionController
export {
    postQuestionController, getQuestionsController,
    getQuestionController, patchQuestionController,
    deleteQuestionController
}
