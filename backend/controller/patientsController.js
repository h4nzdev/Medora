import Patient from "../model/patientsModel.js";
import bcrypt from "bcrypt";

// Add new patient (Register)
export const addPatient = async (req, res) => {
  try {
    const { clinicId, name, age, gender, phone, email, address, password } =
      req.body;

    // check if patient already exists by email or phone
    const existingPatient = await Patient.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient already exists with this email or phone" });
    }

    // hash password before saving
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
    });

    await newPatient.save();
    res.status(201).json({
      message: "Patient registered successfully",
      patient: newPatient,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering patient", error: error.message });
  }
};

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("clinicId", "name plan"); // populate clinic details
    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

// Get single patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "clinicId",
      "name plan"
    );
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patient", error: error.message });
  }
};

// Update patient info
// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, address, password } = req.body;

    // Find the patient first to ensure they exist
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    let updateData = { name, age, gender, phone, email, address };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("clinicId", "name plan clinicName"); // Add clinicName to the populated fields

    if (!updatedPatient)
      return res
        .status(404)
        .json({ message: "Patient not found after update" });

    res.status(200).json({
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating patient", error: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting patient", error: error.message });
  }
};

// Get patients by clinic ID
export const getPatientsByClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;

    // find patients with this clinicId
    const patients = await Patient.find({ clinicId }).populate(
      "clinicId",
      "name plan"
    );

    if (!patients || patients.length === 0) {
      return res
        .status(404)
        .json({ message: "No patients found for this clinic" });
    }

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching patients by clinic",
      error: error.message,
    });
  }
};
