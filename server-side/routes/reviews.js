import express from 'express';
const router = express.Router();

import makeCallback from '../helpers/express-callback'
import reviewController from '../controllers/reviews'

router
    .route('/user/:userId/reviews')
    .post(makeCallback(reviewController.postReviewController));

router.get("/reviews/all", makeCallback(reviewController.getReviewsController));

router
    .route('/user/:userEmail/reviews/:reviewId')
    .patch(makeCallback(reviewController.patchReviewController))
    .delete(makeCallback(reviewController.deleteReviewController));

export {router as reviewsRoutes};
