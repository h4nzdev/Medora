import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-jwt-secret-change-this-in-production";
const JWT_EXPIRES_IN = "24h";

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded;
  } catch (error) {
    console.log("🔐 Token verification failed:", error.message); // ADD THIS
    throw new Error("Invalid token");
  }
};
