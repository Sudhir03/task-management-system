// ─────────────────────────────────────────────
//  models/User.js — User Schema & Model
// ─────────────────────────────────────────────
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Display name shown in the UI
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    // Unique email used for login
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },

    // Bcrypt-hashed password (never store plain text!)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
