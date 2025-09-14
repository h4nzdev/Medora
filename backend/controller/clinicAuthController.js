import bcrypt from "bcrypt";
import Clinic from "../model/clinicModel.js";

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
      agreeToTerms,
      subscriptionPlan,
    });

    // 6. Save to database
    await newClinic.save();

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
