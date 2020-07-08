import express from 'express';
import passport from 'passport'
const router = express.Router();

import logsController from '../controllers/logs'
import makeCallback from '../helpers/express-callback'

router.get("/users/metrics/max/:limit", makeCallback(logsController.getLogsController));

export {router as logsRoutes};
