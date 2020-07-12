import {
    addQuestionService, listQuestionsService,
    getOneQuestionService, editQuestionService, removeQuestionService
} from '../../services/questions'

import makePostQuestionController from './post-question'
import makeGetQuestionsController from './get-questions'
import makeGetOneQuestionController from './get-one-question'
import makePatchQuestionController from './edit-question'
import makeDeleteQuestionController from './remove-question'

import {addLogService} from '../../services/logs'

const postQuestionController = makePostQuestionController({addQuestionService, addLogService});
const getQuestionsController = makeGetQuestionsController({listQuestionsService, addLogService});
const getQuestionController = makeGetOneQuestionController({getOneQuestionService, addLogService});
const patchQuestionController = makePatchQuestionController({editQuestionService,addLogService});
const deleteQuestionController = makeDeleteQuestionController({removeQuestionService,addLogService});

const questionController = Object.freeze({
    postQuestionController, getQuestionsController, getQuestionController,
    patchQuestionController, deleteQuestionController
});

export default questionController
export {
    postQuestionController, getQuestionsController, getQuestionController,
    patchQuestionController, deleteQuestionController
}
