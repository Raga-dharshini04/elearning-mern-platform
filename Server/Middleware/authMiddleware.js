const jwt = require("jsonwebtoken");

// Define the main middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Define verifyToken (even if it's the same logic for now, or a variation)
const verifyToken = authMiddleware; 

// Export them as an object
module.exports = { authMiddleware, verifyToken };