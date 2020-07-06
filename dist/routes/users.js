"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usersRoutes = void 0;

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _expressCallback = _interopRequireDefault(require("../helpers/express-callback"));

var _users = _interopRequireDefault(require("../controllers/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.usersRoutes = router;

const ctrlUsers = require("../old-ctrl/users");

const ctrlAcess = require("../old-ctrl/grandAccess");

/**
 * Session is set to false because we are using JWTs, and don't need a session!
 * * If you do not set this to false, the Passport framework will try and
 * implement a session
 */
router.post("/signup", (0, _expressCallback.default)(_users.default.postUserController));
router.post("/login", (0, _expressCallback.default)(_users.default.loggedInUserController));
router.get("/users/profiles", (0, _expressCallback.default)(_users.default.getUsersController));
router.route("/user/:userId").get((0, _expressCallback.default)(_users.default.getUserController)).patch((0, _expressCallback.default)(_users.default.patchUserController)).delete((0, _expressCallback.default)(_users.default.deleteUserController));
router.patch("/user/:userId/score", (0, _expressCallback.default)(_users.default.patchScoreController));