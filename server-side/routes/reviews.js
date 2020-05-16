const express  = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlReviews = require("../controllers/reviews");
const ctrlUsers = require("../controllers/users");


router
    .route('/user/:userId/reviews')
    .post(passport.authenticate("jwt", {session: false}),
        ctrlReviews.reviewsCreate);

router.get("/reviews/all", ctrlUsers.users_get_all);

router
    .route('/user/:userEmail/reviews/:reviewId')
    .patch(passport.authenticate("jwt", {session: false}),
        ctrlReviews.reviewsUpdateOne)
    .delete(passport.authenticate("jwt", {session: false}),
        ctrlReviews.reviewsDeleteOne);

module.exports = router;
