import express from 'express';
const router = express.Router();
import passport from 'passport'

const ctrlUsers = require("../old-ctrl/users");
const ctrlAcess = require("../old-ctrl/grandAccess");

import makeCallback from '../helpers/express-callback'

import userController  from '../controllers/users'
/**
 * Session is set to false because we are using JWTs, and don't need a session!
 * * If you do not set this to false, the Passport framework will try and
 * implement a session
 */

router.post("/signup", makeCallback(userController.postUserController));
router.post("/login", makeCallback(userController.loggedInUserController));
router.get("/users/profiles", makeCallback(userController.getUsersController));

router
    .route("/user/:userId")
    .get(makeCallback(userController.getUserController))
    .patch(makeCallback(userController.patchUserController))
    .delete(makeCallback(userController.deleteUserController));

router.patch("/user/:userId/score", makeCallback(userController.patchScoreController));

export {router as usersRoutes};



