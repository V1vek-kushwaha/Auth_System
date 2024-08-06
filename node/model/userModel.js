const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      require: true,
    },
    profileImg: {
      type: String,
      require: false,
    },

    password: {
      type: String,
      require: true,
    },
    is_verified: {
      type: Boolean,
      require: true,
      default: false,
    },
    status: {
      type: String,
      required: false,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    usertype: {
      type: String,
      require: true,
      enum: ["normal", "admin", "superAdmin"],
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

//for compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // use bcrypt to compair the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = model("user", UserSchema);
module.exports = User;
