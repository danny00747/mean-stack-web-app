"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeEditQuestionService;

var _domain = require("../../domain");

function makeEditQuestionService({
  questionRepository
}) {
  return async ({
    id,
    ...changes
  } = {}) => {
    if (!id) throw new Error('You must supply an id.');
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new TypeError(`${id} is not a valid ObjectId`);
    const question = (0, _domain.makeQuestion)({ ...changes
    });
    return questionRepository.patch({
      id: id,
      type: question.getType(),
      question: question.getQuestion(),
      answers: question.getAnswers()
    });
  };
}