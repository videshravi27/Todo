const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const token = (req.cookies && req.cookies.token) || tokenFromHeader;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id clerkId");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.clerkId = user.clerkId;
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { requireAuth };
