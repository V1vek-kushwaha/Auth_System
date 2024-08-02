const User = require("../model/userModel");
async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
  } catch (error) {}
}
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

    console.log("data saved", response);
    return res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  handleUserLogin,
  handleUserSignup,
};
