const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);