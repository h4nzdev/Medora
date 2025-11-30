import MedicalRecord from "../model/medicalRecords.js";
import Appointment from "../model/appointmentModel.js";

// ================================
// Create a new medical record
// ================================
export const addMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      clinicId,
      doctorId,
      appointmentId,
      chiefComplaint,
      vitals,
      diagnosis,
      treatment,
      notes,
      prescriptions,
      followUp,
    } = req.body;

    // Create a new record document
    const newRecord = new MedicalRecord({
      patientId,
      clinicId,
      doctorId,
      appointmentId,
      chiefComplaint,
      vitals,
      diagnosis,
      treatment,
      notes,
      prescriptions,
      followUp,
    });

    // Save it to the database
    await newRecord.save();

    // Also update appointment status to "completed" if appointmentId is provided
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: "completed",
      });
    }

    res.status(201).json({
      message: "Medical record created successfully",
      record: newRecord,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Get all medical records
// ================================
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialty")
      .populate("clinicId", "clinicName email")
      .populate("appointmentId", "date status");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Get one medical record by ID
// ================================
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialty")
      .populate("clinicId", "clinicName")
      .populate("appointmentId", "date status");

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Get all records for a specific patient
// ================================
export const getRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      patientId: req.params.patientId,
    })
      .populate("doctorId", "name specialty")
      .populate("clinicId", "clinicName")
      .populate("appointmentId", "date status");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Get all records for a specific clinic
// ================================
export const getRecordsByClinic = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      clinicId: req.params.clinicId,
    })
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialty")
      .populate("appointmentId", "date status");

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical records found for this clinic" });
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Delete a medical record
// ================================
export const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
