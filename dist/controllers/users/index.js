"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchScoreController = exports.deleteUserController = exports.patchUserController = exports.getUserController = exports.getUsersController = exports.loggedInUserController = exports.postUserController = exports.default = void 0;

var _users = require("../../services/users");

var _postUser = _interopRequireDefault(require("./post-user"));

var _logInUser = _interopRequireDefault(require("./logIn-user"));

var _getUsers = _interopRequireDefault(require("./get-users"));

var _getOneUser = _interopRequireDefault(require("./get-one-user"));

var _editUser = _interopRequireDefault(require("./edit-user"));

var _removeUser = _interopRequireDefault(require("./remove-user"));

var _editScore = _interopRequireDefault(require("./edit-score"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postUserController = (0, _postUser.default)({
  addUserService: _users.addUserService
});
exports.postUserController = postUserController;
const loggedInUserController = (0, _logInUser.default)({
  logInUserService: _users.logInUserService,
  bcrypt: _bcrypt.default,
  jwt: _jsonwebtoken.default
});
exports.loggedInUserController = loggedInUserController;
const getUsersController = (0, _getUsers.default)({
  getAllUsersService: _users.getAllUsersService
});
exports.getUsersController = getUsersController;
const getUserController = (0, _getOneUser.default)({
  getOneUserService: _users.getOneUserService
});
exports.getUserController = getUserController;
const patchUserController = (0, _editUser.default)({
  editUserService: _users.editUserService
});
exports.patchUserController = patchUserController;
const deleteUserController = (0, _removeUser.default)({
  removeUserService: _users.removeUserService
});
exports.deleteUserController = deleteUserController;
const patchScoreController = (0, _editScore.default)({
  editScoreService: _users.editScoreService
});
exports.patchScoreController = patchScoreController;
const userController = Object.freeze({
  postUserController,
  loggedInUserController,
  getUsersController,
  getUserController,
  patchUserController,
  deleteUserController,
  patchScoreController
});
var _default = userController;
exports.default = _default;