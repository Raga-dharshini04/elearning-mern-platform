const AdminSettings = require("../Models/AdminSettings");

// In a real app, we'd use req.user.id from middleware, 
// but sticking to your TEST_ADMIN_ID for now.
const TEST_ADMIN_ID = "67c000000000000000000000"; 

// 🔹 Get Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ adminId: TEST_ADMIN_ID });

    if (!settings) {
      // Create default settings if they don't exist for this admin
      settings = await AdminSettings.create({ 
        adminId: TEST_ADMIN_ID,
        displayName: "Admin User",
        platformName: "Omni E-Learning"
      });
    }

    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve settings" });
  }
};

// 🔹 Update Settings
exports.updateSettings = async (req, res) => {
  try {
    // We use findOneAndUpdate with 'upsert' just in case the doc was deleted
    const updated = await AdminSettings.findOneAndUpdate(
      { adminId: TEST_ADMIN_ID },
      { $set: req.body }, // Use $set to update only the fields sent in request
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      message: "Settings updated successfully",
      settings: updated
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update Failed: " + err.message });
  }
};