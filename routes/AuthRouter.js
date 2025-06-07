const express = require("express");
const router = express.Router();
const AuthLogin = require("../auth/auth");

router.get("/", AuthLogin.requiredAuth);

module.exports = router;
