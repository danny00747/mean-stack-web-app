const express  = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlUsers = require("../controllers/users");


router.post("/signup", ctrlUsers.user_signup);
router.delete("/users/:userId", ctrlUsers.user_delete);


module.exports = router;


