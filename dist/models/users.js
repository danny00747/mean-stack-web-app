"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "mongoose", {
  enumerable: true,
  get: function () {
    return _mongoose.default;
  }
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Reviews Schema
const reviewSchema = new _mongoose.default.Schema({
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  reviewText: {
    type: String,
    required: true
  },
  created: {
    type: String
  },
  updated: {
    type: String
  }
}); // Users Schema

const userSchema = new _mongoose.default.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    require: true
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  level: {
    type: String,
    default: "A1",
    enum: ["A1", "A2", "B1", "B2", "C1", "C2"]
  },
  role: {
    type: String,
    default: 'student',
    enum: ["student", "teacher", "admin"]
  },
  reviews: [reviewSchema]
});
userSchema.plugin(_mongooseUniqueValidator.default);

var _default = _mongoose.default.model('User', userSchema, 'users');

exports.default = _default;