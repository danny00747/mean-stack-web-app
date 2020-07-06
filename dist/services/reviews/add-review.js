"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAddReviewService;

var _domain = require("../../domain");

function makeAddReviewService({
  reviewRepository
}) {
  return async ({
    id,
    ...changes
  } = {}) => {
    if (!id) throw new Error('You must supply an id.');
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new TypeError(`${id} is not a valid ObjectId`);
    const existing = await reviewRepository.findById({
      id
    }); //  console.log(existing.reviews.id('5f00e562eead540b94458c06'));

    if (!existing) return {
      message: "No valid entry found for provided id !"
    };
    const review = (0, _domain.makeReview)({ ...changes
    });
    existing.reviews.push({
      author: existing.email,
      rating: review.getRating(),
      reviewText: review.getReviewText(),
      created: review.getCreatedOn(),
      updated: review.getModifiedOn()
    });
    return reviewRepository.save({
      id: id,
      new: true,
      reviews: existing.reviews
    });
  };
}