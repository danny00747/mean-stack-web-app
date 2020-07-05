import makeAddQuestion from './add-question'
import makeListQuestion from './list-questions'
import makeGetOneQuestion from './get-one-question'
import makeEditQuestion from './edit-question'
import makeRemoveQuestion from './remove-question'
import {questionsDb} from '../../data-access/index'

const addQuestion = makeAddQuestion({questionsDb});
const listQuestions = makeListQuestion({questionsDb});
const getOneQuestion = makeGetOneQuestion({questionsDb});
const editQuestion = makeEditQuestion({questionsDb});
const removeQuestion = makeRemoveQuestion({questionsDb});

const questionService = Object.freeze({
  addQuestion, listQuestions, getOneQuestion, editQuestion, removeQuestion
});

export default questionService
export { addQuestion, listQuestions, getOneQuestion, editQuestion, removeQuestion}
