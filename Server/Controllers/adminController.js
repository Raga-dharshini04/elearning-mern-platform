const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const Course = require("../Models/Course");

// 🔹 Add Instructor
exports.addInstructor = async (req, res) => {
  try {
    const { name, email, password, dob, gender } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Instructor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const instructor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "instructor",
      dob,
      gender,
    });

    res.status(201).json({
      message: "Instructor added successfully",
      instructor,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Instructors
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select("-password");

    res.status(200).json(instructors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseCount = async (req, res) => {
  try {
    // This assumes you have a Course model imported above
    const count = await Course.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Make sure you have a Course model defined" });
  }
};

exports.getRecentStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email createdAt")
      .sort({ createdAt: -1 }) // Newest first
      .limit(5);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Instructor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

