"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reviewRepository = exports.userRepository = exports.questionRepository = exports.default = void 0;

var _questionRepository = _interopRequireDefault(require("./questionRepository"));

var _userRepository = _interopRequireDefault(require("./userRepository"));

var _reviewRepository = _interopRequireDefault(require("./reviewRepository"));

var _questions = _interopRequireDefault(require("../models/questions"));

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const questionRepository = (0, _questionRepository.default)({
  Question: _questions.default
});
exports.questionRepository = questionRepository;
const userRepository = (0, _userRepository.default)({
  User: _users.default
});
exports.userRepository = userRepository;
const reviewRepository = (0, _reviewRepository.default)({
  User: _users.default
});
exports.reviewRepository = reviewRepository;
const repositories = Object.freeze({
  questionRepository,
  userRepository,
  reviewRepository
});
var _default = repositories;
exports.default = _default;