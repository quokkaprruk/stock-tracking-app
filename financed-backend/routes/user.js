const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { sign } = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username not found" });
    if (!password)
      return res.status(400).json({ message: "Password not found" });
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Username already exists" });
    }
    user = new User({ username, password });
    await user.save();
    return res.status(200).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }
    const payload = { id: user.id, username: user.username };
    const token = sign(payload, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, token: "Bearer " + token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
