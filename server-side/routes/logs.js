const express = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlLogs = require("../old-ctrl/logs");

router.get("/users/metrics", ctrlLogs.getLogs);

module.exports = router;
