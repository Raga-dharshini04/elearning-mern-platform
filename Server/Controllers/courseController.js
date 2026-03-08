const multer = require("multer");
const path = require("path");
const Course = require("../Models/Course");
const User = require("../Models/User");
const sendEmail = require("../utils/sendEmail");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, duration } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      duration,
      instructorId: req.user.id
    });

    res.status(201).json(course);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get My Courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructorId: req.user.id
    }).populate("students", "name email");

    res.json(courses);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndDelete({
      _id: req.params.id,
      instructorId: req.user.id
    });

    res.json({ message: "Course deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("students", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Assign Student To Course
exports.assignStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const course = await Course.findOne({
      _id: req.params.courseId,
      instructorId: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    res.json(course);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add Material To Course
// Add a new Live Meeting / Google Meet session
exports.addMeeting = async (req, res) => {
  try {
    const { topic, meetLink, scheduledDate, startTime } = req.body;
    
    // 1. Find course and populate students to get their emails
    const course = await Course.findOne({ 
      _id: req.params.courseId, 
      instructorId: req.user.id 
    }).populate("students", "name email notifications"); // Populate notification preferences

    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    const newMeeting = { topic, meetLink, scheduledDate, startTime };
    course.meetings.push(newMeeting);
    await course.save();

    // 2. EMAIL LOGIC: Notify all enrolled students
    course.students.forEach((student) => {
      // Only send if student has alerts enabled in their settings
      if (student.notifications?.liveClassAlerts !== false) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #4318FF;">New Live Class Scheduled</h2>
            <p>Hello <b>${student.name}</b>,</p>
            <p>A new live session has been added to your course: <b>${course.title}</b></p>
            <div style="background-color: #F4F7FE; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p><b>Topic:</b> ${topic}</p>
              <p><b>Date:</b> ${scheduledDate}</p>
              <p><b>Time:</b> ${startTime}</p>
            </div>
            <a href="${meetLink}" style="background-color: #4318FF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block;">Join Class Now</a>
          </div>
        `;
        sendEmail(student.email, `Live Class Alert: ${topic}`, emailHtml);
      }
    });

    res.status(201).json({ message: "Meeting scheduled and students notified", meetings: course.meetings });
  } catch (error) {
    console.error("Error adding meeting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const course = await Course.findOne({
      _id: req.params.courseId,
      instructorId: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.quizzes.push({ title, questions });

    await course.save();

    res.status(201).json({ message: "Quiz added successfully", quizzes: course.quizzes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// 1. Configure how files are stored
const storage = multer.diskStorage({
  destination: "uploads/", 
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
exports.uploadMiddleware = upload.single("file"); // Middleware to use in routes

// 2. The logic to save file info to the Course
exports.uploadAsset = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const course = await Course.findById(courseId).populate("students", "name email notifications");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newUpload = {
      fileName: req.file.originalname,
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      size: (req.file.size / 1024 / 1024).toFixed(2) + " MB"
    };

    course.uploads.push(newUpload);
    await course.save();

    // EMAIL LOGIC: Notify students of new material
    course.students.forEach((student) => {
      if (student.notifications?.courseUpdates !== false) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Material Added!</h3>
            <p>A new file <b>${newUpload.fileName}</b> has been uploaded to <b>${course.title}</b>.</p>
            <p>Log in to your dashboard to download the resources.</p>
          </div>
        `;
        sendEmail(student.email, `New Resource in ${course.title}`, emailHtml);
      }
    });

    res.status(201).json({ message: "File uploaded and students notified", upload: newUpload });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { courseId, assetId } = req.params;
    const course = await Course.findById(courseId);
    
    // Remove the specific upload from the array
    course.uploads = course.uploads.filter(upload => upload._id.toString() !== assetId);
    
    await course.save();
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updatePractice = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, instructions, practiceId } = req.body; // practiceId is optional

    const course = await Course.findById(courseId);
    
    if (practiceId) {
      // UPDATE EXISTING: Find the specific lab in the array and update it
      const lab = course.practice.id(practiceId);
      if (lab) {
        lab.challengeTitle = title;
        lab.instructions = instructions;
      }
    } else {
      // ADD NEW: Push a new object into the array
      course.practice.push({
        challengeTitle: title,
        instructions: instructions
      });
    }

    await course.save();
    res.status(200).json({ message: "Practice Labs updated", practice: course.practice });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};