import express from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientsByClinic,
  updatePatientApproval,
} from "../controller/patientsController.js";

const patientRouter = express.Router();
// Get all patients
patientRouter.get("/", getPatients);

// Get single patient by ID
patientRouter.get("/:id", getPatientById);

// Update patient info
patientRouter.put("/:id", updatePatient);

// Delete patient
patientRouter.delete("/:id", deletePatient);

// get all patients in a clinic
patientRouter.get("/clinic/:clinicId", getPatientsByClinic);

patientRouter.put("/:id/approval", updatePatientApproval);

export default patientRouter;
