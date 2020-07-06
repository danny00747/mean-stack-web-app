"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAddQuestionService;

var _domain = require("../../domain");

function makeAddQuestionService({
  questionRepository
}) {
  return async questionInfo => {
    const question = (0, _domain.makeQuestion)(questionInfo);
    return questionRepository.save({
      type: question.getType(),
      question: question.getQuestion(),
      answers: question.getAnswers()
    });
  };
}