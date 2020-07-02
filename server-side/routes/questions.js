const express = require('express');
const router = express.Router();
const passport = require("passport");

const ctrlQuestions = require('../controllers/questions');

import {postQuestion, getQuestions, getQuestion, patchQuestion, deleteQuestion} from '../crtl'

import makeCallback from '../express-callback'

router
    .route('/questions')
    .get(makeCallback(getQuestions))
    .post(makeCallback(postQuestion));

router
    .route('/questions/:questionId')
    .get(makeCallback(getQuestion))
    .patch(makeCallback(patchQuestion))
    .delete(makeCallback(deleteQuestion));


module.exports = router;
