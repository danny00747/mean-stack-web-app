import express from 'express';
const router = express.Router();
import passport from 'passport'

import makeCallback from '../helpers/express-callback'
import controllers  from '../controllers'
import {userController}  from '../controllers'


/**
 * Session is set to false because we are using JWTs, and don't need a session!
 * * If you do not set this to false, the Passport framework will try and
 * implement a session
 */

router.post("/signup", makeCallback(userController.registerUser));
router.post("/login", makeCallback(userController.logInUser));
router.get("/users/profiles", makeCallback(userController.getAllUsers));
router.get("/user/verify/:key", makeCallback(userController.verifyUser));
router.get("/user/resend/:userEmail", makeCallback(userController.resendEmail));

router
    .route("/user/:userId")
    .get(makeCallback(controllers.userController.getUser))
    .patch(makeCallback(controllers.userController.patchUser))
    .delete(makeCallback(controllers.userController.deleteUser));

router.patch("/user/:userId/score",
    makeCallback(userController.patchScore));

export {router as usersRoutes};



