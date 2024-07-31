const User = require("../model/userModel");
async function handleUserLogin(req, res) {
  res.send("handle login");
}
const handleUserSignup = async (req, res) => {
  //get user data from body
  userData = req.body;
  try {
    //create a new user , useing the moongoose model
    const newUser = new User(userData);
    //save the new user to database
    const response = await newUser.save();

    console.log("data saved", response);
    return res.status(200).json({ response: response });
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  handleUserLogin,
  handleUserSignup,
};
