const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phonenumber: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
    default: Date.now(),
  },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
