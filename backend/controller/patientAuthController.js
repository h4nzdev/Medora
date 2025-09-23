import bcrypt from "bcrypt";
import Patient from "../model/patientsModel.js";
import sendVerificationEmail from "../utils/emailService.js";

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
      res.json({ message: "Verification code sent successfully", code });
    } else {
      res.status(500).json({ message: emailResponse.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending verification code", error: error.message });
  }
};


// Login patient with sessions
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

    res.json({ message: "Login successful", patient: patient });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
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

    // ✅ Check if email already exists
    const existingPatientByEmail = await Patient.findOne({ email });
    if (existingPatientByEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Check if phone already exists
    const existingPatientByPhone = await Patient.findOne({ phone });
    if (existingPatientByPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new patient with emergency contact
    const newPatient = new Patient({
      clinicId,
      name,
      age,
      gender,
      phone,
      email,
      address,
      password: hashedPassword,
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
