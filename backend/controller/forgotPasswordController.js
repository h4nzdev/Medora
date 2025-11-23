// controllers/forgotPasswordController.js
import Patient from "../model/patientsModel.js";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../utils/emailService.js";

// Store verification codes temporarily
const verificationCodes = {};

// Request password reset - FIXED VERSION
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find patient by email
    const patient = await Patient.findOne({ email: email.toLowerCase() });

    // 2. If patient doesn't exist, return error immediately
    if (!patient) {
      return res.status(404).json({
        message:
          "No account found with this email address. Please check your email or create a new account.",
      });
    }

    // 3. Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Store code with expiration (15 minutes)
    verificationCodes[email] = {
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      patientId: patient._id, // Store patient ID for verification
    };

    // 5. Send verification email
    try {
      await sendVerificationEmail(email, code, patient.firstName);
      res.status(200).json({
        message: "Verification code sent to your email!",
        email: email, // Return email for frontend to use in next step
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Clean up the code if email fails
      delete verificationCodes[email];
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      message: "Error processing reset request",
      error: error.message,
    });
  }
};

// Verify code and reset password - FIXED VERSION
export const verifyAndResetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // 1. Check if verification code exists and is valid
    const storedCode = verificationCodes[email];

    if (!storedCode) {
      return res.status(400).json({
        message: "No verification code found. Please request a new one.",
      });
    }

    // 2. Check if code has expired
    if (new Date() > storedCode.expiresAt) {
      delete verificationCodes[email]; // Clean up expired code
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // 3. Verify the code matches
    if (storedCode.code !== code) {
      return res.status(400).json({
        message: "Invalid verification code. Please try again.",
      });
    }

    // 4. Find patient using the stored patientId for extra security
    const patient = await Patient.findById(storedCode.patientId);
    if (!patient) {
      delete verificationCodes[email];
      return res.status(404).json({
        message: "Patient account not found.",
      });
    }

    // 5. Verify email matches (extra security check)
    if (patient.email !== email.toLowerCase()) {
      delete verificationCodes[email];
      return res.status(400).json({
        message: "Email verification failed.",
      });
    }

    // 6. Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    patient.password = hashedPassword;
    await patient.save();

    // 7. Clean up verification code
    delete verificationCodes[email];

    res.status(200).json({
      message:
        "Password reset successfully! You can now login with your new password.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// Optional: Clean up expired codes periodically
setInterval(() => {
  const now = new Date();
  for (const [email, data] of Object.entries(verificationCodes)) {
    if (now > data.expiresAt) {
      delete verificationCodes[email];
    }
  }
}, 60 * 1000); // Run every minute
