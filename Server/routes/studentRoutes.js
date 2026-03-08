const express = require("express");
const router = express.Router();
const { getMyEnrolledCourses, getStudentStats } = require("../Controllers/studentController");
const { submitTask, getCourseSubmissions } = require("../Controllers/submissionController");
const { authMiddleware } = require("../Middleware/authMiddleware"); // Import your middleware


// Added authMiddleware here
router.get("/my-courses", authMiddleware, getMyEnrolledCourses);
router.get("/stats", authMiddleware, getStudentStats);


// Path: /api/student/submit
router.post("/submit", authMiddleware, submitTask);

router.get("/submissions/:courseId", authMiddleware, getCourseSubmissions);


module.exports = router;