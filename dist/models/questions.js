"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const questionSchema = new _mongoose.default.Schema({
  type: {
    type: String,
    require: true,
    enum: ["multiple", "boolean", "fill in"]
  },
  question: {
    type: String,
    required: true
  },
  answers: [{
    option: {
      type: String,
      required: true
    },
    isCorrect: {
      type: String,
      required: true,
      default: false
    }
  }]
});
questionSchema.plugin(_mongooseUniqueValidator.default);

var _default = _mongoose.default.model('Question', questionSchema, 'questions');

exports.default = _default;