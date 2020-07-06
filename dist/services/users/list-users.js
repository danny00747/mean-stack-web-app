"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeListUsersService;

function makeListUsersService({
  userRepository
}) {
  return async () => {
    return userRepository.findAll();
  };
}