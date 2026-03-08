const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const Course = require("../Models/Course");
const Enrollment = require("../Models/Enrollment");
const Submission = require("../Models/Submission");

// Add Student (Instructor creates student)
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, dob, gender } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
      gender,
      role: "student",
      createdBy: req.user.id
    });

    res.status(201).json(student);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get My Students
exports.getMyStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      createdBy: req.user.id
    });

    res.json(students);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Deactivate Student
exports.deactivateStudent = async (req, res) => {
  try {
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { isActive: false },
      { new: true }
    );

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Assign an existing student to a specific course
exports.assignStudentToCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    // FIX: Use the 'Course' model, not the variable 'courseId'
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } }, // Prevents duplicate assignments
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ 
      message: "Student assigned to course successfully",
      course: updatedCourse 
    });
  } catch (err) {
    console.error("Assign Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// In your instructorController.js (or wherever you fetch courses)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id })
      .populate("students", "name email"); // This replaces IDs with actual student data
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove a student from a specific course
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    // Use $pull to remove the specific studentId from the array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: studentId } },
      { new: true }
    ).populate("students", "name email"); // Re-populate so frontend stays updated

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ 
      message: "Student removed from course", 
      course: updatedCourse 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// instructorController.js

exports.getCourseGradebook = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Get the course and populate the students array directly
    const course = await Course.findById(courseId).populate("students", "name email");
    
    if (!course) return res.status(404).json({ message: "Course not found" });

    const totalTasks = (course.quizzes?.length || 0) + (course.practice?.length || 0);

    // 2. Map through course.students (since that's where you saved them)
    const gradebook = await Promise.all(course.students.map(async (student) => {
      const studentSubmissions = await Submission.find({ 
        courseId, 
        studentId: student._id 
      });

      const completedCount = studentSubmissions.length;
      const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

      return {
        studentName: student.name,
        studentEmail: student.email,
        progress: progress,
        submissions: studentSubmissions 
      };
    }));

    res.status(200).json(gradebook);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gradebook", error: err.message });
  }
};