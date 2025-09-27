import express from "express";
import {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorsByClinic,
} from "../controller/doctorController.js";

const doctorRouter = express.Router();

// ➤ Add a doctor
doctorRouter.post("/add-doctor", addDoctor);

// ➤ Get all doctors
doctorRouter.get("/", getDoctors);

// ➤ Get doctors by clinicId
doctorRouter.get("/clinic/:clinicId", getDoctorsByClinic);

// ➤ Get doctor by ID
doctorRouter.get("/:id", getDoctorById);

// ➤ Update doctor by ID
doctorRouter.put("/:id", updateDoctor);

// ➤ Delete doctor by ID
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;
