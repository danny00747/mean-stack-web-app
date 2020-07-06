import express from 'express';

const router = express.Router();
import passport from 'passport'

const ctrlQuestions = require('../controllers/questions');

import questionController from '../controllers/questions'

import makeCallback from '../helpers/express-callback'

router
    .route('/questions')
    .get(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.getQuestionsController))
    .post(makeCallback(questionController.postQuestionController));

router
    .route('/questions/:questionId')
    .get(
        makeCallback(questionController.getQuestionController))
    .patch(makeCallback(questionController.patchQuestionController))
    .delete(makeCallback(questionController.deleteQuestionController));

export {router as questionsRoutes};
