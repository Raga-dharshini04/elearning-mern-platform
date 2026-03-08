const express = require("express");
const router = express.Router();

const {
  addStudent,
  getMyStudents,
  deactivateStudent,
  assignStudentToCourse,
  removeStudentFromCourse,
  getCourseGradebook
} = require("../Controllers/instructorController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-student", authMiddleware, addStudent);
router.get("/students", authMiddleware, getMyStudents);
router.patch("/deactivate-student/:id", authMiddleware, deactivateStudent);
router.post("/assign-student", authMiddleware, assignStudentToCourse);
router.post("/remove-student", authMiddleware, removeStudentFromCourse);
router.get("/gradebook/:courseId", authMiddleware, getCourseGradebook);

module.exports = router;