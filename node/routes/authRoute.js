const { Router } = require("express");

const router = Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const {
  mailVerification,
  resetPassword,
  updatePassword,
  resetsuccess,
} = require("../controller/userController");

router.get("/mail-verification", mailVerification);
router.get("/reset-password", resetPassword);
router.post("/reset-password", updatePassword);
router.get("/reset-success", resetsuccess);

module.exports = router;
