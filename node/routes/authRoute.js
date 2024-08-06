const { Router } = require("express");

const router = Router();

const path = require("path");

const { mailVerification } = require("../controller/userController");

// router.get("/", mailVerification);
router.get("/", (req, res) => {
  res.render("404");
});
module.exports = router;
