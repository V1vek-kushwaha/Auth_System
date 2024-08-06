const { generateToken } = require("../config/jwtAuth");
const User = require("../model/userModel");
const { validationResult } = require("express-validator");
const mailer = require("../utils/mailer");

const randomString = require("randomstring");
const passwordReset = require("../model/passwordReset");
const passResetSchema = require("../model/passwordReset");
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "invalid username or password " });
    }
    // create payload obj for token
    const payload = {
      id: user.id,
    };
    const token = await generateToken(payload);
    return res.status(200).json({ data: user, token: token });
  } catch (error) {
    return res.status(500).json({ error: "internal Server Error" });
  }
};
const handleUserSignup = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: validationErrors.array(),
      });
    }
    //get user data from body
    userData = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "This Email already Registerd" });
    }

    //create a new user , useing the moongoose model
    const newUser = new User(userData);
    //save the new user to database
    const response = await newUser.save();

    // Assuming 'response.id' needs to be replaced with something else
    const verificationLink = `http://localhost:8000/mail-verification?id=${userData.id}`;
    const msg = `<p>Hi ${userData.name}, please <a href="${verificationLink}">Verify</a> your email.</p>`;

    mailer.sendMail(userData.email, "Mail Verification", msg);

    // create payload obj for token
    const payload = {
      id: response.id,
    };
    const token = await generateToken(payload);
    console.log("data saved", token);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const mailVerification = async (req, res) => {
  try {
    if (req.query.id === "undifine") {
      return res.render("404");
    }

    const userData = await User.findOne({ _id: req.query.id });

    if (userData.is_verified === true) {
      return res.render("mail-verification", {
        message: "This Mail is Already Verified ",
      });
    }

    if (userData) {
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            is_verified: true,
          },
        }
      );

      return res.render("mail-verification", {
        message: "Mail has been Verified Successfully",
      });
    } else {
      return res.render("mail-verification", { message: "User Not Found" });
    }
  } catch (error) {
    return res.render("404");
  }
};

const sendMailVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res
        .status(400)
        .json({ success: false, msg: "Email doesn't exist" });
    }
    if (userData.is_verified === true) {
      return res.status(400).json({
        success: false,
        msg: `${userData.email} mail is already verified!`,
      });
    }

    // Assuming 'response.id' needs to be replaced with something else
    const verificationLink = `http://localhost:8000/mail-verification?id=${userData.id}`;
    const msg = `<p>Hi ${userData.name}, please <a href="${verificationLink}">Verify</a> your email.</p>`;

    // Assuming 'mailer.sendMail' is asynchronous and returns a promise
    await mailer.sendMail(userData.email, "Mail Verification", msg);
    return res
      .status(200)
      .json({ msg: "Verification Link Sent to your mail Please check" });
  } catch (error) {
    return res.status(400).json({ msg: `${error.message} ` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res
        .status(400)
        .json({ success: false, msg: "Email doesn't exist" });
    }

    const randomstring = randomString.generate();
    const msg =
      "<p>hi " +
      userData.name +
      ',please check <a href="http://localhost:8000/reset-password?token=' +
      randomstring +
      '">here</a>to reset your password</p>';
    const passwordReset = new passResetSchema({
      user_id: userData._id,
      token: randomstring,
    });
    await passwordReset.save();

    mailer.sendMail(userData.email, "Reset Password", msg);
    return res.status(200).json({
      success: true,
      msg: "Reset Link send to your mail, please check!",
    });
  } catch (error) {
    return res.status(400).json({ msg: `${error.message} catch` });
  }
};

module.exports = {
  handleUserLogin,
  handleUserSignup,
  mailVerification,
  sendMailVerification,
  forgotPassword,
};
