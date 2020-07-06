import makeAddReviewService from './add-review'
import makeListReviewsService from './list-reviews'
import makeEditReviewService from './edit-review'
import makeRemoveReviewService from './remove-review'
import {reviewRepository} from '../../repository'

const addReviewService = makeAddReviewService({reviewRepository});
const getAllReviewsService = makeListReviewsService({reviewRepository});
const editReviewService = makeEditReviewService({reviewRepository});
const removeReviewService = makeRemoveReviewService({reviewRepository});

const reviewService = Object.freeze({
    addReviewService, getAllReviewsService, editReviewService, removeReviewService
});

export default reviewService
export {addReviewService, getAllReviewsService, editReviewService, removeReviewService}
