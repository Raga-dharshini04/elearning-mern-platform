const Submission = require("../Models/Submission");

exports.submitTask = async (req, res) => {
  try {
    const { courseId, type, itemId, score, totalQuestions, submissionLink } = req.body;
    const studentId = req.user.id; // From your auth middleware

    // Check if student already submitted this specific item
    const existing = await Submission.findOne({ studentId, itemId });
    if (existing && type === 'quiz') {
       return res.status(400).json({ message: "You have already taken this quiz." });
    }

    const newSubmission = new Submission({
      studentId,
      courseId,
      type,
      itemId,
      score,
      totalQuestions,
      submissionLink,
      status: type === 'quiz' ? 'Graded' : 'Pending' // Quizzes are auto-graded, Labs need instructor review
    });

    await newSubmission.save();
    res.status(201).json({ message: "Submission successful!", submission: newSubmission });
  } catch (err) {
    res.status(500).json({ message: "Error saving submission", error: err.message });
  }
};

// Add this to your existing submissionController.js
exports.getCourseSubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // Find all submissions by this student for this specific course
    const submissions = await Submission.find({ studentId, courseId });

    // Extract only the itemIds into a flat array
    const submittedIds = submissions.map(sub => sub.itemId);

    res.status(200).json({ submittedIds });
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions", error: err.message });
  }
};