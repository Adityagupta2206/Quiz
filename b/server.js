// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// --- ENV Vars ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// --- MongoDB Connection ---
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  score: { type: Number, default: 0 },
  lastTestDate: { type: Date, default: null }, // for 24hr cooldown
});

const User = mongoose.model("User", userSchema);

// --- Auto Create Admin ---
async function createAdmin() {
  try {
    const adminExists = await User.findOne({ username: ADMIN_EMAIL });
    if (adminExists) return console.log("👑 Admin already exists");
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name: "Admin",
      username: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin created:", ADMIN_EMAIL);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}
 //createAdmin();

// --- Signup ---
app.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, username, password: hashed });

    res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// --- Login ---
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      role: user.role,
      username: user.username,
      name: user.name,
      score: user.score,
      lastTestDate: user.lastTestDate,
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// --- Submit Quiz (with Retest Cooldown) ---
app.post("/submit-quiz", async (req, res) => {
  try {
    const { username, score } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();

    // If user already gave test, check 24hr lock
    if (user.lastTestDate) {
      const hoursSinceLastTest =
        (now - new Date(user.lastTestDate)) / (1000 * 60 * 60);
      if (hoursSinceLastTest < 24) {
        const remainingHours = (24 - hoursSinceLastTest).toFixed(1);
        return res.status(403).json({
          message: `⏳ Retest available after ${remainingHours} hours`,
        });
      }
    }

    // Update user with new score and timestamp
    user.score = score;
    user.lastTestDate = now;
    await user.save();

    res.json({ message: "✅ Quiz submitted successfully", score });
  } catch (err) {
    console.error("❌ Quiz Submit Error:", err);
    res.status(500).json({ message: "Server error while submitting quiz" });
  }
});

// --- Update Score (Manual/Admin use) ---
app.post("/update-score", async (req, res) => {
  try {
    const { username, score } = req.body;
    const user = await User.findOneAndUpdate(
      { username },
      { score },
      { new: true }
    );
    res.json({ message: "Score updated successfully", user });
  } catch (err) {
    console.error("❌ Update Score Error:", err);
    res.status(500).json({ message: "Server error updating score" });
  }
});

// --- Get All Users (for Admin Dashboard) ---
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "name username score lastTestDate"
    );
    res.json(users);
  } catch (err) {
    console.error("❌ Get Users Error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// --- Root Test Route ---
app.get("/", (req, res) => res.send("🚀 MERN Quiz Auth Server is Running..."));

// --- Start Server ---
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));
