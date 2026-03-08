const mongoose = require("mongoose");

// --- UPDATED: Meeting Schema (Replaces Materials) ---
const meetingSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  meetLink: { type: String, required: true }, // The Google Meet URL
  scheduledDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., "10:30 AM"
  description: { type: String }
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema]
}, { timestamps: true });

const uploadSchema = new mongoose.Schema({
  fileName: { type: String },
  fileUrl: { type: String },
  size: { type: String }
}, { timestamps: true });

const practiceSchema = new mongoose.Schema({
  challengeTitle: { type: String, required: true },
  instructions: { type: String, required: true }, 
  starterFileUrl: { type: String },
  starterFileName: { type: String },
  starterFileSize: { type: String }
}, { timestamps: true });

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    category: String,
    duration: String,
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    icon: { type: String },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    
    // Using the new Live Class schema
    meetings: [meetingSchema], 
    
    quizzes: [quizSchema],
    uploads: [uploadSchema],
    practice: [practiceSchema], 

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);