const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    dob: {
      type: Date,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    usertype: {
      type: String,
      require: true,
      enum: ["normal", "admin"],
      default: "normal",
    },
  },
  { timestamps: true }
);

const User = model("user", UserSchema);
module.exports = User;
