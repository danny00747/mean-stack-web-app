import {
    addReviewService, getAllReviewsService, editReviewService, removeReviewService
} from '../../services/reviews'

import {addLogService} from '../../services/logs'

import makePostReviewController from './post-review'
import makeGetReviewsController from './get-reviews'
import makePatchReviewController from './edit-review'
import makeDeleteReviewController from './remove-review'

const postReviewController = makePostReviewController({addReviewService});
const getReviewsController = makeGetReviewsController({getAllReviewsService, addLogService});
const patchReviewController = makePatchReviewController({editReviewService});
const deleteReviewController = makeDeleteReviewController({removeReviewService});

const reviewController = Object.freeze({
    postReviewController, getReviewsController, patchReviewController, deleteReviewController
});

export default reviewController
export {postReviewController, getReviewsController, patchReviewController, deleteReviewController}
