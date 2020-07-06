"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeReview = exports.makeUser = exports.makeQuestion = exports.default = void 0;

var _question = _interopRequireDefault(require("./question"));

var _reviews = _interopRequireDefault(require("./reviews"));

var _user = _interopRequireDefault(require("./user"));

var _emailValidator = _interopRequireDefault(require("email-validator"));

var _requiredParameter = _interopRequireDefault(require("../helpers/required-parameter"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const makeQuestion = (0, _question.default)(requiredParameter);
exports.makeQuestion = makeQuestion;
const makeReview = (0, _reviews.default)(requiredParameter);
exports.makeReview = makeReview;
const makeUser = (0, _user.default)(isValidEmail, hashPassword, requiredParameter);
exports.makeUser = makeUser;

function hashPassword(password) {
  return _bcrypt.default.hashSync(password, 10);
}

function isValidEmail(email) {
  return _emailValidator.default.validate(email);
}

const entities = Object.freeze({
  makeQuestion,
  makeUser
});

function requiredParameter(param) {
  return (0, _requiredParameter.default)(param);
}

var _default = entities;
exports.default = _default;