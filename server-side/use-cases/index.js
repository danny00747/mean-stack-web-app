import makeAddQuestion from './add-question'
import questionsDb from '../data-access/index'

const addQuestion = makeAddQuestion({questionsDb});

const questionService = Object.freeze({
  addQuestion
});

export default questionService
export { addQuestion }
