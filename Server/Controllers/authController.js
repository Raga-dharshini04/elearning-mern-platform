const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");

// 🔐 Hardcoded Admin Credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 HARDCODED ADMIN LOGIN (NO DATABASE)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

      const token = jwt.sign(
        { role: "admin" },  // admin role inside token
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        role: "admin",
        token
      });
    }

    // 👤 DATABASE USERS (Instructor / Student)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};