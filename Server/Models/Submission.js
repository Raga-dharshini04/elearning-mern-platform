const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["quiz", "lab"], 
    required: true 
  },
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }, // This will be the specific Quiz ID or Practice Lab ID
  
  // Quiz specific data
  score: { type: Number }, 
  totalQuestions: { type: Number },
  
  // Lab specific data
  submissionLink: { type: String }, // The URL the student submits
  status: { 
    type: String, 
    enum: ["Pending", "Graded"], 
    default: "Pending" 
  },
  grade: { type: String }, // e.g., "A", "Pass", or "10/10"
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);