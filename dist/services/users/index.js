"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editScoreService = exports.removeUserService = exports.editUserService = exports.getOneUserService = exports.getAllUsersService = exports.logInUserService = exports.addUserService = exports.default = void 0;

var _registerUser = _interopRequireDefault(require("./register-user"));

var _logInUser = _interopRequireDefault(require("./logIn-user"));

var _listUsers = _interopRequireDefault(require("./list-users"));

var _getOneUser = _interopRequireDefault(require("./get-one-user"));

var _editUser = _interopRequireDefault(require("./edit-user"));

var _removeUser = _interopRequireDefault(require("./remove-user"));

var _editScore = _interopRequireDefault(require("./edit-score"));

var _index = require("../../repository/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addUserService = (0, _registerUser.default)({
  userRepository: _index.userRepository
});
exports.addUserService = addUserService;
const logInUserService = (0, _logInUser.default)({
  userRepository: _index.userRepository
});
exports.logInUserService = logInUserService;
const getAllUsersService = (0, _listUsers.default)({
  userRepository: _index.userRepository
});
exports.getAllUsersService = getAllUsersService;
const getOneUserService = (0, _getOneUser.default)({
  userRepository: _index.userRepository
});
exports.getOneUserService = getOneUserService;
const editUserService = (0, _editUser.default)({
  userRepository: _index.userRepository
});
exports.editUserService = editUserService;
const removeUserService = (0, _removeUser.default)({
  userRepository: _index.userRepository
});
exports.removeUserService = removeUserService;
const editScoreService = (0, _editScore.default)({
  userRepository: _index.userRepository
});
exports.editScoreService = editScoreService;
const userService = Object.freeze({
  addUserService,
  logInUserService,
  getAllUsersService,
  getOneUserService,
  editUserService,
  removeUserService,
  editScoreService
});
var _default = userService;
exports.default = _default;