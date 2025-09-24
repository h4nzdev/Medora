import Patient from "../model/patientsModel.js";
import bcrypt from "bcrypt";

// Add new patient
export const addPatient = async (req, res) => {
  try {
    const { clinicId, name, age, gender, phone, email, address, password } = req.body;

    const existingPatient = await Patient.findOne({ $or: [{ email }, { phone }] });
    if (existingPatient) return res.status(400).json({ message: "Patient already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      clinicId, name, age, gender, phone, email, address, password: hashedPassword
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
  } catch (error) {
    res.status(500).json({ message: "Error registering patient", error: error.message });
  }
};

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("clinicId", "name plan");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("clinicId", "name plan");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, address, password } = req.body;

    let updateData = { name, age, gender, phone, email, address };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, updateData, { new: true }
    );

    if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error: error.message });
  }
};

// Get patients by clinic
export const getPatientsByClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const patients = await Patient.find({ clinicId }).populate("clinicId", "name plan");
    if (!patients || patients.length === 0) return res.status(404).json({ message: "No patients found" });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients by clinic", error: error.message });
  }
};
