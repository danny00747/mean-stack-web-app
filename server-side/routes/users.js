import express from 'express';
const router = express.Router();
import passport from 'passport'

const ctrlUsers = require("../controllers/users");
const ctrlAcess = require("../controllers/grandAccess");

import {postUser, loggedInUser, getUsers, getUser, patchUser, deleteUser, patchScore} from '../crtl/users'
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
    .patch(makeCallback(patchUser))
    .delete(makeCallback(deleteUser));

router.patch("/user/:userId/score", makeCallback(patchScore));


export {router as usersRoutes};



