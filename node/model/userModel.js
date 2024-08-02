const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
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
      type: String,
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

//hashing the password using bcrypt
//pre used for
UserSchema.pre("save", async function (next) {
  const user = this;

  //hash the password only if it has been modified or new
  if (!user.isModified("password")) return next();

  try {
    //hash password generatin
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // overwrite the plain password with hashed password
    user.password = hashedPassword;
    return next();
  } catch (error) {
    console.log("hashpassword Error", error);
    return next(error);
  }
});

const User = model("user", UserSchema);
module.exports = User;
