import express from 'express';
const router = express.Router();

import makeCallback from '../helpers/express-callback'
import {reviewController} from '../controllers'

router
    .route('/user/:userId/reviews')
    .post(makeCallback(reviewController.postReview));

router.get("/reviews/all", makeCallback(reviewController.getAllReviews));

router
    .route('/user/:userEmail/reviews/:reviewId')
    .patch(makeCallback(reviewController.patchReview))
    .delete(makeCallback(reviewController.deleteReview));

export {router as reviewsRoutes};
