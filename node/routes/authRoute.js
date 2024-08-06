const { Router } = require("express");

const router = Router();

const path = require("path");

const { mailVerification } = require("../controller/userController");

router.get("/", mailVerification);

module.exports = router;
