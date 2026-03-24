// ─────────────────────────────────────────────
//  models/Task.js — Task Schema & Model
// ─────────────────────────────────────────────
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Link each task to its owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    // Task due date (stored as Date, sent as ISO string from client)
    date: {
      type: Date,
      required: [true, "Due date is required"],
    },

    // "pending" by default; set to "completed" when user marks done
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    history: [{
      message: String,
      user: String,
      date: { type: Date, default: Date.now }
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
