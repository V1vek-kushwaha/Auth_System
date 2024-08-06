const { Router } = require("express");
const {
  handleUserLogin,
  handleUserSignup,
  sendMailVerification,
  forgotPassword,
} = require("../controller/userController");
const router = Router();

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // check for img extentions
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../public/images"));
    }
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const {
  signupValidator,
  sendMailVerificationValidator,
  passwordValidator,
} = require("../utils/validation");

router.post("/login", handleUserLogin);
router.post(
  "/signup",
  upload.single("profileImg"),
  signupValidator,
  handleUserSignup
);

router.post(
  "/send-mail-verification",
  sendMailVerificationValidator,
  sendMailVerification
);

router.post("/forgot-password", passwordValidator, forgotPassword);
module.exports = router;
