const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.SERVER_PORT || 8000;
const userRouter = require("./routes/userRoutes");
const connectDB = require("./config/databaseConnection");

// Connect to the database
connectDB();
// body parcer
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.send("Server Running Smoothly..🚀");
});
app.use("/user", userRouter);

app.listen(PORT, () =>
  console.log(`server is running http://localhost:${PORT}`)
);
