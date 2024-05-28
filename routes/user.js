const express = require("express");

const {UserRegisteration,UserLogin} = require("../controllers/user");

const router = express();

router.post("/signup",UserRegisteration);
router.post("/signin",UserLogin);


module.exports = router;