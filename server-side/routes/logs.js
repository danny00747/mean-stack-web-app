import express from 'express';
import passport from 'passport'
const router = express.Router();

import {logController} from '../controllers'
import makeCallback from '../helpers/express-callback'

router.get("/users/metrics/max/:limit", makeCallback(logController.getLogs));

export {router as logsRoutes};
