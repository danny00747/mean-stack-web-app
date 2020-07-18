import express from 'express';
import passport from 'passport'
const router = express.Router();

//passport.authenticate("jwt", {session: false}),

import questionController from '../controllers/questions'
import makeCallback from '../helpers/express-callback'

router
    .route('/questions')
    .get(makeCallback(questionController.getQuestionsController))
    .post(makeCallback(questionController.postQuestionController));

router
    .route('/questions/:questionId')
    .get(
        makeCallback(questionController.getQuestionController))
    .patch(makeCallback(questionController.patchQuestionController))
    .delete(makeCallback(questionController.deleteQuestionController));

export {router as questionsRoutes};
