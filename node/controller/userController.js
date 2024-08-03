const { generateToken } = require("../config/jwtAuth");
const User = require("../model/userModel");
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

module.exports = {
  handleUserLogin,
  handleUserSignup,
};
