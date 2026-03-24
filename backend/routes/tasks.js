// ─────────────────────────────────────────────
//  routes/tasks.js — Task CRUD Endpoints
//  All routes are protected by the auth middleware
// ─────────────────────────────────────────────
const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const Notification = require("../models/Notification");
const protect = require("../middleware/auth");

const router = express.Router();

// Apply the JWT guard to every route in this file
router.use(protect);

// ── GET /api/tasks ────────────────────────────
// Fetch all tasks belonging to the logged-in user or shared with them
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ userId: req.user.id }, { sharedWith: req.user.id }]
    }).sort({
      createdAt: -1, // newest first
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// ── POST /api/tasks ───────────────────────────
// Create a new task for the logged-in user
router.post("/", async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      date,
      priority: priority || "medium",
      status: "pending",
      history: [{ message: "Task created", user: req.user.name || "Owner" }]
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// ── PUT /api/tasks/:id ────────────────────────
// Update a task (toggle status, edit fields)
router.put("/:id", async (req, res) => {
  try {
    // Find the task and make sure it belongs to current user or is shared with them
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user.id }, { sharedWith: req.user.id }]
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only update fields that were sent in the request body
    const { title, description, date, status, priority } = req.body;
    let updatedDetails = false;

    if (title !== undefined && title !== task.title) { task.title = title; updatedDetails = true; }
    if (description !== undefined && description !== task.description) { task.description = description; updatedDetails = true; }
    if (date !== undefined) { task.date = date; updatedDetails = true; }
    if (priority !== undefined && priority !== task.priority) { task.priority = priority; updatedDetails = true; }
    
    if (status !== undefined && status !== task.status) { 
      task.status = status; 
      task.history.push({ message: `Marked as ${status}`, user: req.user.name || "User" });
    }

    if (updatedDetails) {
      task.history.push({ message: "Task details updated", user: req.user.name || "User" });
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// ── DELETE /api/tasks/:id ─────────────────────
// Permanently delete a task
router.delete("/:id", async (req, res) => {
  try {
    // findOneAndDelete ensures users can only delete their own tasks
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// ── POST /api/tasks/:id/share ─────────────────
// Share a task with another user by email
router.post("/:id/share", async (req, res) => {
  try {
    // Only the owner can share the task
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found or you don't have permission to share it." });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required to share." });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "No user found with that email address." });
    }

    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot share a task with yourself." });
    }

    if (task.sharedWith.includes(targetUser._id)) {
      return res.status(400).json({ message: "Task is already shared with this user." });
    }

    task.sharedWith.push(targetUser._id);
    task.history.push({ 
      message: `Task shared with ${targetUser.name || targetUser.email}`, 
      user: req.user.name || "Owner" 
    });
    
    await task.save();

    // Fire off a real-time Notification for the target user
    await Notification.create({
      userId: targetUser._id,
      message: `${req.user.name || "A colleague"} shared the task "${task.title}" with you.`,
      taskId: task._id
    });
    
    res.json(task);
  } catch (err) {
    console.error("Share task error:", err.message);
    res.status(500).json({ message: "Failed to share task" });
  }
});

module.exports = router;
