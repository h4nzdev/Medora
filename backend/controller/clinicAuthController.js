import bcrypt from "bcrypt";
import Clinic from "../model/clinicModel.js";
import sendVerificationEmail from "../utils/emailService.js";

const verificationCodes = {};

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

// Login clinic with sessions
export const loginClinic = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find clinic by email
    const clinic = await Clinic.findOne({ email });
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, clinic.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", clinic: clinic });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Register a new clinic
export const clinicRegister = async (req, res) => {
  try {
    // 1. Get data from the request body (frontend form)
    const {
      clinicName,
      contactPerson,
      email,
      password,
      confirmPassword,
      phone,
      address,
      agreeToTerms,
      subscriptionPlan,
    } = req.body;

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3. Check if clinic email already exists
    const existingClinic = await Clinic.findOne({ email });
    if (existingClinic) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new clinic document
    const newClinic = new Clinic({
      clinicName,
      contactPerson,
      email,
      password: hashedPassword, // save hashed password
      phone,
      address,
      clinicPicture: req.file ? req.file.path : "", // Save the public URL path
      agreeToTerms,
      subscriptionPlan,
    });

    // 6. Save to database
    await newClinic.save();
    req.io.emit("clinic_updated");

    // 7. Success response
    res.status(201).json({
      message: "Clinic registered successfully",
      clinic: newClinic,
    });
  } catch (error) {
    console.error("Error in clinicRegister:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send password change verification for clinic
export const sendClinicPasswordChangeVerification = async (req, res) => {
  try {
    const { email, currentPassword } = req.body;

    // 1. Find clinic and verify current password
    const clinic = await Clinic.findOne({ email });
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // 2. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      clinic.password
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

// Verify and change clinic password
export const verifyAndChangeClinicPassword = async (req, res) => {
  try {
    const { email, verificationCode, currentPassword, newPassword } = req.body;

    // 1. Verify the code (REUSE YOUR EXISTING SYSTEM)
    if (verificationCodes[email] !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // 2. Find clinic and verify current password again (for security)
    const clinic = await Clinic.findOne({ email });
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      clinic.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 3. Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    clinic.password = hashedNewPassword;
    await clinic.save();

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

// Simple password update (for admin use - no verification)
export const updateClinicPassword = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { newPassword } = req.body;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    clinic.password = hashedPassword;
    await clinic.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating password",
      error: error.message,
    });
  }
};
