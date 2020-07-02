import {
  addQuestion
} from '../use-cases'


import makePostQuestion from './post-question'

const postQuestion = makePostQuestion({ addQuestion });

const questionController = Object.freeze({
  postQuestion
});

export default questionController
export { postQuestion }
