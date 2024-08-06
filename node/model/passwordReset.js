const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const passwordResetSchema = new Schema(
  {
    user_Id: {
      type: String,
      require: true,
      ref: "user",
    },
    token: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const passResetSchema = model("passwordreset", passwordResetSchema);
module.exports = passResetSchema;
