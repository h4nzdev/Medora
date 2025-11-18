import { verifyToken } from "../utils/jwtUtils.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in.",
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("🔐 Auth Middleware - Error:", error.message); // ADD THIS
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// Admin-only access
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

// Clinic-only access
export const requireClinic = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }

  if (req.user.role !== "Clinic") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Clinic privileges required.",
    });
  }

  next();
};

// Patient-only access
export const requirePatient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }

  if (req.user.role !== "Patient") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Patient privileges required.",
    });
  }

  next();
};
