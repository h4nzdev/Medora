import bcrypt from "bcrypt";
import Admin from "../model/adminModel.js";
import { generateToken } from "../utils/jwtUtils.js";

// Login admin - UPDATED TO SET SESSION
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ CREATE JWT TOKEN instead of session
    const tokenPayload = {
      _id: admin._id,
      email: admin.email,
      role: "Admin",
      admin_name: admin.admin_name,
    };

    const token = generateToken(tokenPayload);

    res.json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        email: admin.email,
        admin_name: admin.admin_name,
        role: "Admin",
      },
      token: token, // ✅ Send token to frontend
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Logout admin - UPDATED FOR JWT
export const logoutAdmin = (req, res) => {
  // With JWT, logout is handled on the client side by removing the token
  res.json({
    message:
      "Logged out successfully. Please remove the token from client storage.",
  });
};

// Create admin (for direct post requests - no verification needed)
export const createAdmin = async (req, res) => {
  try {
    const { admin_name, email, password } = req.body;

    // Check if admin email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      admin_name,
      email,
      password: hashedPassword,
    });

    // Save to database
    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error in createAdmin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update admin password
export const updateAdminPassword = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating password",
      error: error.message,
    });
  }
};

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};
