import express from 'express';
import passport from 'passport'
const router = express.Router();

//passport.authenticate("jwt", {session: false}),

import {questionController} from '../controllers'
import makeCallback from '../helpers/express-callback'

router
    .route('/questions')
    .get(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.getAllQuestions))
    .post(makeCallback(questionController.postQuestion));

router
    .route('/questions/:questionId')
    .get(makeCallback(questionController.getQuestion))
    .patch(makeCallback(questionController.patchQuestion))
    .delete(makeCallback(questionController.deleteQuestion));

export {router as questionsRoutes};
