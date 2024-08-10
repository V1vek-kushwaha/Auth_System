const { Schema, model } = require("mongoose");

const blackListSchema = new Schema(
  {
    token: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Blacklist = model("blacklist", blackListSchema);
module.exports = Blacklist;
