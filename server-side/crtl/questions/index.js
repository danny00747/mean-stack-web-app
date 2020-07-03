import {
  addQuestion, listQuestions, getOneQuestion, editQuestion, removeQuestion
} from '../../use-cases/questions'

import makePostQuestion from './post-question'
import makeGetQuestions from './get-questions'
import makeGetOneQuestion from './get-one-question'
import makePatchQuestion from './edit-question'
import makeDeleteQuestion from './remove-question'

const postQuestion = makePostQuestion({ addQuestion });
const getQuestions = makeGetQuestions({ listQuestions });
const getQuestion = makeGetOneQuestion({ getOneQuestion });
const patchQuestion = makePatchQuestion({ editQuestion });
const deleteQuestion = makeDeleteQuestion({ removeQuestion });

const questionController = Object.freeze({
  postQuestion, getQuestions, getQuestion, patchQuestion, deleteQuestion
});

export default questionController
export { postQuestion, getQuestions, getQuestion, patchQuestion, deleteQuestion }
