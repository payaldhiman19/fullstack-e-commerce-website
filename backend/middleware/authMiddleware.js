const jwt = require("jsonwebtoken");

// 1. protect: is the user logged in?
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Header must look like: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Checks the signature and expiry, then returns the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save it so later functions can use req.user.userId and req.user.role
    req.user = decoded;

    next(); // move on to the next function
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 2. adminOnly: is the logged-in user an admin?
// Always use it AFTER protect, because it needs req.user
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin")  return next();
    return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };