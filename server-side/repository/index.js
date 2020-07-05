import makeQuestionRepository from './questionRepository'
import makeUserRepository from './userRepository'
import makeReviewRepository from './reviewRepository'
import Question from '../models/questions'
import User from '../models/users'

const questionRepository = makeQuestionRepository({Question});
const userRepository = makeUserRepository({User});
const reviewRepository = makeReviewRepository({User});

const repositories = Object.freeze({
    questionRepository, userRepository, reviewRepository
});

export default repositories
export {questionRepository, userRepository, reviewRepository}

