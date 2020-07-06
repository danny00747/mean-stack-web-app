"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reviewsRoutes = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressCallback = _interopRequireDefault(require("../helpers/express-callback"));

var _reviews = _interopRequireDefault(require("../controllers/reviews"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.reviewsRoutes = router;

const ctrlReviews = require("../controllers/reviews");

const ctrlUsers = require("../controllers/users");

router.route('/user/:userId/reviews').post((0, _expressCallback.default)(_reviews.default.postReviewController));
router.get("/reviews/all", (0, _expressCallback.default)(_reviews.default.getReviewsController));
router.route('/user/:userEmail/reviews/:reviewId').patch((0, _expressCallback.default)(_reviews.default.patchReviewController)).delete((0, _expressCallback.default)(_reviews.default.deleteReviewController));