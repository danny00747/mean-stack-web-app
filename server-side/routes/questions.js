import express from 'express';
const router = express.Router();
import passport from 'passport'

const ctrlQuestions = require('../controllers/questions');

import {postQuestion,
    getQuestions,
    getQuestion, patchQuestion, deleteQuestion} from '../crtl/questions'

import makeCallback from '../express-callback'

router
    .route('/questions')
    .get(passport.authenticate("jwt", {session: false}),
        makeCallback(getQuestions))
    .post(makeCallback(postQuestion));

router
    .route('/questions/:questionId')
    .get(
        makeCallback(getQuestion))
    .patch(makeCallback(patchQuestion))
    .delete(makeCallback(deleteQuestion));

export {router as questionsRoutes};
