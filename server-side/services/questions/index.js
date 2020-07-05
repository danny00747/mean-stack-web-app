import makeAddQuestionService from './add-question'
import makeListQuestionService from './list-questions'
import makeGetOneQuestionService from './get-one-question'
import makeEditQuestionService from './edit-question'
import makeRemoveQuestionService from './remove-question'
import {questionRepository} from '../../repository/index'

const addQuestionService = makeAddQuestionService({questionRepository});
const listQuestionsService = makeListQuestionService({questionRepository});
const getOneQuestionService = makeGetOneQuestionService({questionRepository});
const editQuestionService = makeEditQuestionService({questionRepository});
const removeQuestionService = makeRemoveQuestionService({questionRepository});

const questionService = Object.freeze({
    addQuestionService, listQuestionsService,
    getOneQuestionService, editQuestionService, removeQuestionService
});

export default questionService
export {
    addQuestionService, listQuestionsService,
    getOneQuestionService, editQuestionService, removeQuestionService
}
