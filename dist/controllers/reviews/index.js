"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteReviewController = exports.patchReviewController = exports.getReviewsController = exports.postReviewController = exports.default = void 0;

var _reviews = require("../../services/reviews");

var _postReview = _interopRequireDefault(require("./post-review"));

var _getReviews = _interopRequireDefault(require("./get-reviews"));

var _editReview = _interopRequireDefault(require("./edit-review"));

var _removeReview = _interopRequireDefault(require("./remove-review"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postReviewController = (0, _postReview.default)({
  addReviewService: _reviews.addReviewService
});
exports.postReviewController = postReviewController;
const getReviewsController = (0, _getReviews.default)({
  getAllReviewsService: _reviews.getAllReviewsService
});
exports.getReviewsController = getReviewsController;
const patchReviewController = (0, _editReview.default)({
  editReviewService: _reviews.editReviewService
});
exports.patchReviewController = patchReviewController;
const deleteReviewController = (0, _removeReview.default)({
  removeReviewService: _reviews.removeReviewService
});
exports.deleteReviewController = deleteReviewController;
const reviewController = Object.freeze({
  postReviewController,
  getReviewsController,
  patchReviewController,
  deleteReviewController
});
var _default = reviewController;
exports.default = _default;