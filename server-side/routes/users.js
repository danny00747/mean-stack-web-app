const express = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlUsers = require("../controllers/users");


router.post("/signup", ctrlUsers.user_signup);
router.post("/login", ctrlUsers.user_login);
router
    .get("/users/profiles", passport.authenticate("jwt", {session: false}),
        ctrlUsers.grantAccess('readAny', 'profile'),
        ctrlUsers.users_get_all);

router
    .route("/user/:userId")
    .get(passport.authenticate("jwt", {session: false}),
        ctrlUsers.grantAccess('readOwn', 'profile'),
        ctrlUsers.get_user_by_id)

    .delete(ctrlUsers.user_delete)

    .patch(passport.authenticate("jwt", {session: false}),
        ctrlUsers.grantAccess('updateOwn', 'profile'),
        ctrlUsers.update_user);


module.exports = router;


