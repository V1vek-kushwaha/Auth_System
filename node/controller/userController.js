const { generateToken } = require("../middleware/jwtAuth");
const User = require("../model/userModel");
const { validationResult } = require("express-validator");
const mailer = require("../utils/mailer");

const randomString = require("randomstring");
const passResetSchema = require("../model/passwordReset");
const passwordReset = require("../model/passwordReset");
const handleUserLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
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
    const verificationLink = `http://localhost:8000/auth/mail-verification?id=${userData.id}`;
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
    const verificationLink = `http://localhost:8000/auth/mail-verification?id=${userData.id}`;
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
      ',please check <a href="http://localhost:8000/auth/reset-password?token=' +
      randomstring +
      '">here</a>to reset your password</p>';

    await passResetSchema.deleteMany({ user_Id: userData.id });

    const passwordReset = new passResetSchema({
      user_Id: userData._id,
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
const resetPassword = async (req, res) => {
  try {
    console.log(req);
    if (req.query.token == undefined) {
      return res.render("404");
    }

    const resetData = await passResetSchema.findOne({
      token: req.query.token,
    });

    if (!resetData) {
      return res.render("404");
    }

    return res.render("reset-password", { resetData: resetData });
  } catch (error) {
    return res.status(400).json({ msg: `${error.message}` });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { password, cpassword, user_Id } = req.body;
    const resetData = await passResetSchema.findOne({ user_Id });
    if (password !== cpassword) {
      return res.render("reset-password", {
        resetData: resetData,
        error: "Confirm Password not Matching",
      });
    }

    const user = await User.findById({ _id: user_Id });

    user.password = cpassword;
    await user.save();

    await passwordReset.deleteOne({ user_Id });
    return res.redirect("/auth/reset-success");
  } catch (error) {
    return res.status(400).json({ msg: `${error.message}` });
  }
};
const resetsuccess = async (req, res) => {
  try {
    return res.render("reset-success");
  } catch (error) {}
};
const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById({ _id: userId });
    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({ msg: `${error.message}` });
  }
};
const UpdateuserProfile = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ success: false, errors: errors.array() });
    // }
    const userId = req.user.id;
    const { name, phone, dob } = req.body;
    const data = {
      name,
      phone,
      dob,
    };
    if (req.file !== undefined) {
      data.profileImg = "image/" + req.file.filename;
    }
    const updatedData = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: data,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      mgs: "User Profile Updated",
      data: updatedData,
    });
  } catch (error) {
    return res.status(400).json({ msg: `${error.message}` });
  }
};
module.exports = {
  handleUserLogin,
  handleUserSignup,
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetsuccess,
  userProfile,
  UpdateuserProfile,
};
