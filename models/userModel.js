const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling

// Define the schema for users
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // This field is required
    unique: true, // Usernames must be unique
  },

  hashedPassword: {
    type: String,
    required: true, // This field is required
  },

  role: {
    type: String,
    enum: ["user", "admin"], // Limited to 'user' or 'admin' roles
    default: "user", // Default role is 'user'
  },
});

// Customize toJSON method to exclude hashedPassword when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, obj) => {
    delete obj.hashedPassword; // Remove hashedPassword from the output
  },
});

module.exports = mongoose.model("User", userSchema); // Export the User model