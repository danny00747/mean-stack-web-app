"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _questions = require("./questions");

var _users = require("./users");

var _reviews = require("./reviews");

const routes = Object.freeze({
  questionsRoutes: _questions.questionsRoutes,
  usersRoutes: _users.usersRoutes,
  reviewsRoutes: _reviews.reviewsRoutes
});
var _default = routes;
exports.default = _default;