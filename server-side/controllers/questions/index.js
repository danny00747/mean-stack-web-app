import {
    addQuestionService, listQuestionsService,
    getOneQuestionService, editQuestionService, removeQuestionService
} from '../../services/questions'

import makePostQuestionController from './post-question'
import makeGetQuestionsController from './get-questions'
import makeGetOneQuestionController from './get-one-question'
import makePatchQuestionController from './edit-question'
import makeDeleteQuestionController from './remove-question'

const postQuestionController = makePostQuestionController({addQuestionService});
const getQuestionsController = makeGetQuestionsController({listQuestionsService});
const getQuestionController = makeGetOneQuestionController({getOneQuestionService});
const patchQuestionController = makePatchQuestionController({editQuestionService});
const deleteQuestionController = makeDeleteQuestionController({removeQuestionService});

const questionController = Object.freeze({
    postQuestionController, getQuestionsController, getQuestionController,
    patchQuestionController, deleteQuestionController
});

export default questionController
export {
    postQuestionController, getQuestionsController, getQuestionController,
    patchQuestionController, deleteQuestionController
}
