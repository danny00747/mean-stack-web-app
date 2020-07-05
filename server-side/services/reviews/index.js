import makeAddReview from './add-review'
import makeListReviews from './list-reviews'
import makeEditReview from './edit-review'
import makeRemoveReview from './remove-review'
import {reviewDb} from '../../data-access/index'

const addReview = makeAddReview({reviewDb});
const getAllReviews = makeListReviews({reviewDb});
const editReview = makeEditReview({reviewDb});
const removeReview = makeRemoveReview({reviewDb});

const reviewService = Object.freeze({
    addReview, getAllReviews, editReview, removeReview
});

export default reviewService
export {addReview, getAllReviews, editReview, removeReview}
