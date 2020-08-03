import express from 'express';
import passport from 'passport'
const router = express.Router();

import {questionController} from '../controllers'
import makeCallback from '../helpers/express-callback'

router
    .route('/questions')
    .get(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.getAllQuestions))
    .post(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.postQuestion));

router
    .route('/questions/:questionId')
    .get(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.getQuestion))

    .patch(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.patchQuestion))

    .delete(passport.authenticate("jwt", {session: false}),
        makeCallback(questionController.deleteQuestion));

export {router as questionsRoutes};
