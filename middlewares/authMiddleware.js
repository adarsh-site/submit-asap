import { User } from "../models/userModel.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Access Denied. Invalid Token." });

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Error", error.message);
    return res
      .status(401)
      .json({ message: "Access Denied. Invalid or Expired Token." });
  }
};

// Middleware to authorize admin only
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};
