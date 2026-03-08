const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "student",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    profilePic: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);