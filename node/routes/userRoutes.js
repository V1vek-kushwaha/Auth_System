const { Router } = require("express");
const {
  handleUserLogin,
  handleUserSignup,
  sendMailVerification,
  forgotPassword,
  userProfile,
  UpdateuserProfile,
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
  loginValidator,
  updateProfileValidator,
} = require("../utils/validation");
const { isAuth } = require("../middleware/jwtAuth");

router.post("/login", loginValidator, handleUserLogin);
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
router.get("/profile", isAuth, userProfile);
router.post(
  "/update-profile",
  isAuth,
  upload.single("profileImg"),

  UpdateuserProfile
);
module.exports = router;
