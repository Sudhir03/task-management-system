// ─────────────────────────────────────────────
//  server.js — Express App Entry Point
// ─────────────────────────────────────────────
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const notificationRoutes = require("./routes/notifications");

const app = express();

// ── Middleware ────────────────────────────────
app.use(cors()); // Allow cross-origin requests from React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// ── Routes ────────────────────────────────────
app.use("/api", authRoutes); // /api/register  /api/login
app.use("/api/tasks", taskRoutes); // /api/tasks  /api/tasks/:id
app.use("/api/notifications", notificationRoutes);

// ── Health check ──────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running ✓" });
});

// ── Global error handler ──────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ── Connect to MongoDB, then start server ─────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const serverurl = process.env.SERVER_URL || `http://localhost:${PORT}`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on ${serverurl}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
