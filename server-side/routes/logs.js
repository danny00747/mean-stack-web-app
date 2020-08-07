import express from 'express';
import passport from 'passport'
const router = express.Router();

import {logController} from '../controllers'
import makeCallback from '../helpers/express-callback'
import grantAccess from "../security/grandAccess";

router.get("/users/metrics/max/:limit",
    passport.authenticate("jwt", {session: false}),
    grantAccess('readAny', 'profile'),
    makeCallback(logController.getLogs));

export {router as logsRoutes};
