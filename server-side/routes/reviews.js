import express from 'express';
const router = express.Router();
import passport from 'passport'

import makeCallback from '../helpers/express-callback'
import {reviewController} from '../controllers'
import grantAccess from "../security/grandAccess";

router.get("/reviews/all", makeCallback(reviewController.getAllReviews));

router
    .post("/user/:userId/reviews",
        passport.authenticate("jwt", {session: false}),
        grantAccess('createOwn', 'review'),
        makeCallback(reviewController.postReview));

router
    .route('/user/:username/reviews/:reviewId')
    .patch(passport.authenticate("jwt", {session: false}),
        grantAccess('updateOwn', 'review'),
        makeCallback(reviewController.patchReview))

    .delete(passport.authenticate("jwt", {session: false}),
        grantAccess('deleteOwn', 'review'),
        makeCallback(reviewController.deleteReview));

export {router as reviewsRoutes};
