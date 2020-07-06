"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeListQuestionService;

function makeListQuestionService({
  questionRepository
}) {
  return async () => {
    return questionRepository.findAll();
  };
}