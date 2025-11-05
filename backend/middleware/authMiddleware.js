// middleware/authMiddleware.js

// General authentication - checks if user is logged in
export const authenticate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }
  req.user = req.session.user; // Set for consistency
  next();
};

// Admin-only access
export const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }

  if (req.session.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  req.user = req.session.user;
  next();
};

// Clinic-only access
export const requireClinic = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }

  if (req.session.user.role !== "Clinic") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Clinic privileges required.",
    });
  }

  req.user = req.session.user;
  next();
};

// Patient-only access
export const requirePatient = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in.",
    });
  }

  if (req.session.user.role !== "Patient") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Patient privileges required.",
    });
  }

  req.user = req.session.user;
  next();
};
