"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteQuestionController = exports.patchQuestionController = exports.getQuestionController = exports.getQuestionsController = exports.postQuestionController = exports.default = void 0;

var _questions = require("../../services/questions");

var _postQuestion = _interopRequireDefault(require("./post-question"));

var _getQuestions = _interopRequireDefault(require("./get-questions"));

var _getOneQuestion = _interopRequireDefault(require("./get-one-question"));

var _editQuestion = _interopRequireDefault(require("./edit-question"));

var _removeQuestion = _interopRequireDefault(require("./remove-question"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postQuestionController = (0, _postQuestion.default)({
  addQuestionService: _questions.addQuestionService
});
exports.postQuestionController = postQuestionController;
const getQuestionsController = (0, _getQuestions.default)({
  listQuestionsService: _questions.listQuestionsService
});
exports.getQuestionsController = getQuestionsController;
const getQuestionController = (0, _getOneQuestion.default)({
  getOneQuestionService: _questions.getOneQuestionService
});
exports.getQuestionController = getQuestionController;
const patchQuestionController = (0, _editQuestion.default)({
  editQuestionService: _questions.editQuestionService
});
exports.patchQuestionController = patchQuestionController;
const deleteQuestionController = (0, _removeQuestion.default)({
  removeQuestionService: _questions.removeQuestionService
});
exports.deleteQuestionController = deleteQuestionController;
const questionController = Object.freeze({
  postQuestionController,
  getQuestionsController,
  getQuestionController,
  patchQuestionController,
  deleteQuestionController
});
var _default = questionController;
exports.default = _default;