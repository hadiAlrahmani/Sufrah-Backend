const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  hashedPassword: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.set("toJSON", {
  transform: (doc, obj) => {
    delete obj.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
