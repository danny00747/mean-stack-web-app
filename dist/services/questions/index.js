"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeQuestionService = exports.editQuestionService = exports.getOneQuestionService = exports.listQuestionsService = exports.addQuestionService = exports.default = void 0;

var _addQuestion = _interopRequireDefault(require("./add-question"));

var _listQuestions = _interopRequireDefault(require("./list-questions"));

var _getOneQuestion = _interopRequireDefault(require("./get-one-question"));

var _editQuestion = _interopRequireDefault(require("./edit-question"));

var _removeQuestion = _interopRequireDefault(require("./remove-question"));

var _index = require("../../repository/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addQuestionService = (0, _addQuestion.default)({
  questionRepository: _index.questionRepository
});
exports.addQuestionService = addQuestionService;
const listQuestionsService = (0, _listQuestions.default)({
  questionRepository: _index.questionRepository
});
exports.listQuestionsService = listQuestionsService;
const getOneQuestionService = (0, _getOneQuestion.default)({
  questionRepository: _index.questionRepository
});
exports.getOneQuestionService = getOneQuestionService;
const editQuestionService = (0, _editQuestion.default)({
  questionRepository: _index.questionRepository
});
exports.editQuestionService = editQuestionService;
const removeQuestionService = (0, _removeQuestion.default)({
  questionRepository: _index.questionRepository
});
exports.removeQuestionService = removeQuestionService;
const questionService = Object.freeze({
  addQuestionService,
  listQuestionsService,
  getOneQuestionService,
  editQuestionService,
  removeQuestionService
});
var _default = questionService;
exports.default = _default;