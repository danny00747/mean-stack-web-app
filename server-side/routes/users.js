import express from 'express';
const router = express.Router();
import passport from 'passport'

import makeCallback from '../helpers/express-callback'
import controllers  from '../controllers'
import {userController}  from '../controllers'
import grantAccess from "../security/grandAccess";

/**
 * Session is set to false because we are using JWTs, and don't need a session!
 * If you do not set this to false, the passport framework will try to implement a session.
 */

router.post("/signup", makeCallback(userController.registerUser));
router.post("/login", makeCallback(userController.logInUser));
router.get("/user/verify/:key", makeCallback(userController.verifyUser));
router.get("/user/resend/:userEmail", makeCallback(userController.resendEmail));
router.get("/users/profiles",
    passport.authenticate("jwt", {session: false}),
    grantAccess('readAny', 'profile'),
    makeCallback(userController.getAllUsers));

router
    .route("/user/:userId")
    .get(passport.authenticate("jwt", {session: false}),
        grantAccess('readOwn', 'profile'),
        makeCallback(controllers.userController.getUser))

    .patch(passport.authenticate("jwt", {session: false}),
        grantAccess('updateOwn', 'profile'),
        makeCallback(controllers.userController.patchUser))

    .delete(passport.authenticate("jwt", {session: false}),
        grantAccess('deleteOwn', 'profile'),
        makeCallback(controllers.userController.deleteUser));

router.patch("/user/:userId/score",
    passport.authenticate("jwt", {session: false}),
    grantAccess('updateOwn', 'profile'),
    makeCallback(userController.patchScore));

export {router as usersRoutes};



