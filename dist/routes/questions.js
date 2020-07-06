"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.questionsRoutes = void 0;

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _questions = _interopRequireDefault(require("../controllers/questions"));

var _expressCallback = _interopRequireDefault(require("../helpers/express-callback"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.questionsRoutes = router;

const ctrlQuestions = require('../controllers/questions');

router.route('/questions').get(_passport.default.authenticate("jwt", {
  session: false
}), (0, _expressCallback.default)(_questions.default.getQuestionsController)).post((0, _expressCallback.default)(_questions.default.postQuestionController));
router.route('/questions/:questionId').get((0, _expressCallback.default)(_questions.default.getQuestionController)).patch((0, _expressCallback.default)(_questions.default.patchQuestionController)).delete((0, _expressCallback.default)(_questions.default.deleteQuestionController));