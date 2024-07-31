const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 8000;
const userRouter = require("./routes/userRoutes");

app.get("/", (req, res) => {
  return res.send("Server Running Smoothly..🚀");
});
app.use("/user", userRouter);

app.listen(PORT, () =>
  console.log(`server is running http://localhost:${PORT}`)
);
