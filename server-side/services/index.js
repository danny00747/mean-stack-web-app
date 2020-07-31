import userServiceFactory from './userService'
import reviewServiceFactory from './reviewService'
import questionServiceFactory from './questionService'
import logServiceFactory from './logService'

import {userRepository, tokenRepository} from '../repository'
import {reviewRepository} from '../repository'
import {questionRepository} from '../repository'
import {logsRepository} from '../repository'

const userService = userServiceFactory({userRepository, tokenRepository});
const reviewService = reviewServiceFactory({reviewRepository});
const questionService = questionServiceFactory({questionRepository});
const logService = logServiceFactory({logsRepository});

const services = Object.freeze({
    userService, reviewService, questionService, logService
});

export default services
export {userService, reviewService, questionService, logService}
