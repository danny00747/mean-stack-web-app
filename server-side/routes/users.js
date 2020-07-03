
const express = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlUsers = require("../controllers/users");
const ctrlAcess = require("../controllers/grandAccess");

import {postUser, loggedInUser, getUsers, getUser} from '../crtl/users'
import makeCallback from '../express-callback'

/**
 * Session is set to false because we are using JWTs, and don't need a session!
 * * If you do not set this to false, the Passport framework will try and
 * implement a session
 */

router.post("/signup", makeCallback(postUser));
router.post("/login", makeCallback(loggedInUser));
router.get("/users/profiles", makeCallback(getUsers));

router
    .route("/user/:userId")
    .get(makeCallback(getUser))

    .delete(passport.authenticate("jwt", {session: false}),
        ctrlAcess.grantAccess('deleteOwn', 'profile'),
        ctrlUsers.user_delete)

    .patch(passport.authenticate("jwt", {session: false}),
        ctrlAcess.grantAccess('updateOwn', 'profile'),
        ctrlUsers.update_user);

router.patch("/user/:userId/score",
    passport.authenticate("jwt", {session: false}),
    ctrlAcess.grantAccess('updateOwn', 'profile'),
    ctrlUsers.update_user_score);


module.exports = router;


