const { check } = require("express-validator");

exports.signupValidator = [
  check("name", "Name is Required").not().isEmpty(),
  check("email", "please include valid Email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("name", "Name is Required").not().isEmpty(),
  check(
    "password",
    "Password must be greater than 6 characters , and contains at least one UPPERCASE and one lowercase  "
  ).isStrongPassword({
    minLenght: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumber: 1,
  }),
  //   check("profileImg")
  //     .custom((value, { req }) => {
  //       if (A
  //         req.file.mimetype === "image/jpeg" ||
  //         req.file.mimetype === "image/png"
  //       ) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     })
  //     .withMessage("please upload an image Jpeg ,PNG"),
];

exports.sendMailVerificationValidator = [
  check("email", "please include valid Email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
];

exports.passwordValidator = [
  check("email", "please include valid Email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
];

exports.loginValidator = [
  check("email", "please include valid Email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "please enter Valid password").not().isEmpty(),
];

exports.updateProfileValidator = [
  check("name", "Name is Required").not().isEmpty(),

  check("phone", "Name is Required").not().isEmpty(),
  check("dob", "Name is Required").not().isEmpty(),
];
