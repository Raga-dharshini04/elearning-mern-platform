const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
app.use("/api/admin/settings", adminSettingsRoutes);

const instructorRoutes = require("./routes/instructorRoutes");

app.use("/api/instructor", instructorRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/api/student", studentRoutes);

app.use("/api/auth", authRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Mongo URI:", process.env.MONGO_URI);
});

