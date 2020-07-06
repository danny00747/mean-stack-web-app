"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeReviewService = exports.editReviewService = exports.getAllReviewsService = exports.addReviewService = exports.default = void 0;

var _addReview = _interopRequireDefault(require("./add-review"));

var _listReviews = _interopRequireDefault(require("./list-reviews"));

var _editReview = _interopRequireDefault(require("./edit-review"));

var _removeReview = _interopRequireDefault(require("./remove-review"));

var _index = require("../../repository/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addReviewService = (0, _addReview.default)({
  reviewRepository: _index.reviewRepository
});
exports.addReviewService = addReviewService;
const getAllReviewsService = (0, _listReviews.default)({
  reviewRepository: _index.reviewRepository
});
exports.getAllReviewsService = getAllReviewsService;
const editReviewService = (0, _editReview.default)({
  reviewRepository: _index.reviewRepository
});
exports.editReviewService = editReviewService;
const removeReviewService = (0, _removeReview.default)({
  reviewRepository: _index.reviewRepository
});
exports.removeReviewService = removeReviewService;
const reviewService = Object.freeze({
  addReviewService,
  getAllReviewsService,
  editReviewService,
  removeReviewService
});
var _default = reviewService;
exports.default = _default;