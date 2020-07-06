"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeLogInUserService;

function makeLogInUserService({
  userRepository
}) {
  return async userInfo => {
    return userRepository.findPseudo(userInfo.pseudo);
  };
}