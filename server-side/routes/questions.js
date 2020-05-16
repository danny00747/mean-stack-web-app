const express = require('express');
const router = express.Router();
const passport = require("passport");

const ctrlQuestions = require('../controllers/questions');

router
    .route('/questions')
    .get(passport.authenticate("jwt", {session: false}),
        ctrlQuestions.question_get_all)
    .post(passport.authenticate("jwt", {session: false}),
        ctrlQuestions.questionCreate);

router
    .route('/questions/:questionId')
    .get(passport.authenticate("jwt", {session: false}),
        ctrlQuestions.question_get_one)
    .patch(passport.authenticate("jwt", {session: false}),
        ctrlQuestions.question_update_one)
    .delete(passport.authenticate("jwt", {session: false}),
        ctrlQuestions.question_delete_one);


module.exports = router;
