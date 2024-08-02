const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");
require("dotenv").config();

const dbURL = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    // No need for useNewUrlParser or useUnifiedTopology options
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
