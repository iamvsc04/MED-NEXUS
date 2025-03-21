const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateJWT = (req, res, next) => {
  // Fixed function name
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(400).json({ message: "User is not authenticated" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

const checkRole = (role) => (req, res, next) => {
  if (req.user?.roles?.[role]) return next();
  res.status(403).json({ message: "Access Denied" });
};

module.exports = { authenticateJWT, checkRole }; // Fixed export
