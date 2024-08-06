const { generateToken } = require("../config/jwtAuth");
const User = require("../model/userModel");
const { validationResult } = require("express-validator");
const mailer = require("../utils/mailer");
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

    const msg =
      "<p> hi ," +
      userData.name +
      ', please <a href="https://localhost:8000/mail-verification?id=' +
      response.id +
      '">Verify </a> a your mail </p>';

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

    if (userData) {
      return res.render("mail-verification", { message: "User Not Found" });
    } else {
      return res.render("mail-verification", { message: "User Not Found" });
    }
  } catch (error) {
    return res.render("404");
  }
};

module.exports = {
  handleUserLogin,
  handleUserSignup,
  mailVerification,
};
