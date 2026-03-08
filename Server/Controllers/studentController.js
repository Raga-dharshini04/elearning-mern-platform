const mongoose = require("mongoose");
const Course = require("../Models/Course");
const Enrollment = require("../Models/Enrollment");
const Submission = require("../Models/Submission");

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    // 1. Ensure we are using a real ObjectId for the query
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    // 2. Use $in to explicitly look inside the students array
    const enrolledCourses = await Course.find({ 
      students: { $in: [studentId] } 
    }).populate("instructorId", "name email");

    res.status(200).json(enrolledCourses);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get all courses the student is enrolled in
    const courses = await Course.find({ students: studentId });
    const courseCount = courses.length;

    // 2. Count real quiz submissions from the database
    const quizCount = await Submission.countDocuments({ 
      studentId, 
      type: "quiz" 
    });

    // 3. Get IDs of everything the student has already submitted
    const submissions = await Submission.find({ studentId }).select('itemId');
    const submittedIds = submissions.map(s => s.itemId.toString());

    // 4. Generate "Upcoming Tasks" (only show items NOT submitted)
    let pendingTasks = [];
    courses.forEach(course => {
      // Add Quizzes not yet done
      course.quizzes.forEach(quiz => {
        if (!submittedIds.includes(quiz._id.toString())) {
          pendingTasks.push({
            title: quiz.title,
            courseName: course.title,
            type: "Quiz",
            id: quiz._id
          });
        }
      });

      // Add Labs not yet done
      course.practice.forEach(lab => {
        if (!submittedIds.includes(lab._id.toString())) {
          pendingTasks.push({
            title: lab.challengeTitle,
            courseName: course.title,
            type: "Lab",
            id: lab._id
          });
        }
      });
    });

    res.status(200).json({
      courseCount,
      quizCount, // This will now show the real number of quizzes taken
      tasks: pendingTasks.slice(0, 3) // Show only the next 3 things to do
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
