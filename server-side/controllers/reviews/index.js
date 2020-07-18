import makePostReviewController from './post-review'
import makeGetReviewsController from './get-reviews'
import makePatchReviewController from './edit-review'
import makeDeleteReviewController from './remove-review'

const postReviewController = makePostReviewController();
const getReviewsController = makeGetReviewsController();
const patchReviewController = makePatchReviewController();
const deleteReviewController = makeDeleteReviewController();

const reviewController = Object.freeze({
    postReviewController, getReviewsController,
    patchReviewController, deleteReviewController
});

export default reviewController
export {postReviewController, getReviewsController,
    patchReviewController, deleteReviewController}
