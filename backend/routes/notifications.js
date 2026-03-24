// ─────────────────────────────────────────────
//  routes/notifications.js — Notification API
// ─────────────────────────────────────────────
const express = require("express");
const Notification = require("../models/Notification");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Fetch all notifications for the logged-in user
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ 
      createdAt: -1 
    });
    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err.message);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark a specific notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    console.error("Update notification error:", err.message);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// Mark all notifications as read
router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Update all notifications error:", err.message);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
});

module.exports = router;
