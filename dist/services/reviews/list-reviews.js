"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeListReviewsService;

function makeListReviewsService({
  reviewRepository
}) {
  return async () => {
    return reviewRepository.findAll();
  };
}