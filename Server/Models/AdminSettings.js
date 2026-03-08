const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  displayName: String,
  username: String,
  profilePic: String,

  platformName: { type: String, default: "E-Learning Platform" },
  maintenanceMode: { type: Boolean, default: false },
  allowRegistration: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },

  sessionTimeout: { type: Number, default: 30 }, // minutes

}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);