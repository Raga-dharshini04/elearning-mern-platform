const express = require("express");
const router = express.Router();

const {
  createCourse,
  getMyCourses,
  deleteCourse,
  assignStudent,
  addMeeting,
  getSingleCourse,
  addQuiz,
  uploadMiddleware,
  uploadAsset,
  deleteAsset,
  updatePractice,
} = require("../Controllers/courseController");

const { authMiddleware, verifyToken } = require("../Middleware/authMiddleware");

router.post("/create", authMiddleware, createCourse);
router.get("/", authMiddleware, getMyCourses);
router.delete("/:id", authMiddleware, deleteCourse);
router.get("/:courseId", verifyToken, getSingleCourse);
router.post("/:courseId/assign", authMiddleware, assignStudent);
router.post("/:courseId/meeting", verifyToken, addMeeting);

router.post("/:courseId/quiz", verifyToken, addQuiz);

router.post("/:courseId/upload", verifyToken, uploadMiddleware, uploadAsset);
router.delete("/:courseId/assets/:assetId", verifyToken, deleteAsset);
router.post("/:courseId/practice", verifyToken, updatePractice);

module.exports = router;