const jwt = require("jsonwebtoken");

//jwt authentication middleware for extract auth token and Verify  from headers
const isAuth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }

  try {
    //verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Attach user information to request object
    req.user = decoded;
    //req.user is key we can add this key by any name (key = value)
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "invalid token" });
  }
};

//function to generate JWT token
const generateToken = async (userData) => {
  // generate token
  return jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: "1d" });
  // somw time if time ex not work then convert userData in obj (jwt issue)
  // return jwt.sign({userData}, process.env.SECRET_KEY, { expiresIn: "1d" });
};

module.exports = { generateToken, isAuth };
