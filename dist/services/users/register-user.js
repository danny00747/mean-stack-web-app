"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAdduserService;

var _domain = require("../../domain");

function makeAdduserService({
  userRepository
}) {
  return async userInfo => {
    const user = (0, _domain.makeUser)({ ...userInfo
    });
    const existing = await userRepository.findByEmailOrUsername({ ...userInfo
    });
    if (existing.length !== 0) return {
      message: "A user with the same username or email already exists !"
    };
    return userRepository.save({
      username: user.getUsername(),
      email: user.getEmail(),
      password: user.getPassword(),
      reviews: user.getReviews(),
      role: user.getRole(),
      score: user.getScore()
    });
  };
}