const express = require("express");
const router = express.Router();
const {
  addInstructor,
  getAllInstructors,
  deleteInstructor,
  getStudentCount,
  getCourseCount,
  getRecentStudents
} = require("../Controllers/adminController");

router.post("/add-instructor", addInstructor);
router.get("/instructors", getAllInstructors);
router.delete("/delete-instructor/:id", deleteInstructor);
router.get("/students/count", getStudentCount);
router.get("/courses/count", getCourseCount);
router.get("/recent-students", getRecentStudents);


module.exports = router;