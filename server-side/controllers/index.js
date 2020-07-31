import userControllerFactory from './userController'
import reviewControllerFactory from './reviewController'
import questionControllerFactory from './questionController'
import logControllerFactory from './logsController'

const userController = userControllerFactory();
const reviewController = reviewControllerFactory();
const questionController = questionControllerFactory();
const logController = logControllerFactory();


const controllers = Object.freeze({
    userController, reviewController, questionController, logController
});

export default controllers
export {userController, reviewController, questionController, logController}
