import bcrypt from "bcrypt";
import Patient from "../model/patientsModel.js";
import sendVerificationEmail from "../utils/emailService.js";
import { generateToken } from "../utils/jwtUtils.js";

// In-memory store for verification codes. In production, use Redis or a similar store.
const verificationCodes = {};

// Send verification code
export const sendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;

    // Send the email
    const emailResponse = await sendVerificationEmail(email, code);

    if (emailResponse.success) {
      // In a real app, you wouldn't send the code back to the client.
      // You'd store it in the session or a temporary database.
      res.json({ message: "Verification code sent successfully" });
    } else {
      res.status(500).json({ message: emailResponse.message });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error sending verification code",
      error: error.message,
    });
  }
};

// Login patient with sessions - UPDATED TO SET SESSION
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find patient by email and populate clinicId
    const patient = await Patient.findOne({ email }).populate("clinicId");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ CREATE JWT TOKEN instead of session
    const tokenPayload = {
      _id: patient._id,
      email: patient.email,
      role: "Client",
      name: patient.name,
      clinicId: patient.clinicId,
    };

    const token = generateToken(tokenPayload);

    // Create patient object without password
    const patientWithoutPassword = patient.toObject();
    delete patientWithoutPassword.password;

    res.json({
      message: "Login successful",
      patient: patientWithoutPassword,
      token: token, // Send token to frontend
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Add patient logout function
export const logoutPatient = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};

export const registerClient = async (req, res) => {
  try {
    const {
      clinicId,
      name,
      age,
      gender,
      phone,
      email,
      address,
      password,
      emergencyContact,
      verificationCode, // Added for verification
    } = req.body;

    // Verify the code
    if (verificationCodes[email] !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    const existingPatientByEmail = await Patient.findOne({ email });
    if (existingPatientByEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPatientByPhone = await Patient.findOne({ phone });
    if (existingPatientByPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      clinicId,
      name,
      age,
      gender,
      phone,
      email,
      address,
      password: hashedPassword,
      patientPicture: req.file ? req.file.path : "",
      emergencyContact, // 👈 added this line
    });

    await newPatient.save();

    // Clean up the verification code
    delete verificationCodes[email];

    res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: newPatient._id,
        name: newPatient.name,
        email: newPatient.email,
        emergencyContact: newPatient.emergencyContact, // 👈 optional return
      },
    });
  } catch (error) {
    // Extra check: catch Mongo duplicate error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `${duplicateField} already registered` });
    }

    res.status(500).json({
      message: "Error registering patient",
      error: error.message,
    });
  }
};

// Send password change verification
export const sendPasswordChangeVerification = async (req, res) => {
  try {
    const { email, currentPassword } = req.body;

    // 1. Find patient and verify current password
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 2. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      patient.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 3. Generate verification code (REUSE YOUR EXISTING SYSTEM)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;

    // 4. Send email (REUSE YOUR EXISTING EMAIL SERVICE)
    const emailResponse = await sendVerificationEmail(email, code);

    if (emailResponse.success) {
      res.json({ message: "Verification code sent successfully" });
    } else {
      res.status(500).json({ message: emailResponse.message });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error sending verification code",
      error: error.message,
    });
  }
};

// Verify and change password
export const verifyAndChangePassword = async (req, res) => {
  try {
    const { email, verificationCode, currentPassword, newPassword } = req.body;

    // 1. Verify the code (REUSE YOUR EXISTING SYSTEM)
    if (verificationCodes[email] !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // 2. Find patient and verify current password again (for security)
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      patient.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 3. Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    patient.password = hashedNewPassword;
    await patient.save();

    // 4. Clean up verification code
    delete verificationCodes[email];

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};
