import express from "express";
import {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorsByClinic,
} from "../controller/doctorController.js";
import upload from "../middleware/multerConfig.js";

const doctorRouter = express.Router();

// ➤ Add a doctor
doctorRouter.post("/add-doctor", upload.single("profileImage"), addDoctor);

// ➤ Get all doctors
doctorRouter.get("/", getDoctors);

// ➤ Get doctors by clinicId
doctorRouter.get("/clinic/:clinicId", getDoctorsByClinic);

// ➤ Get doctor by ID
doctorRouter.get("/:id", getDoctorById);

// ➤ Update doctor by ID
doctorRouter.put("/:id", upload.single("profileImage"), updateDoctor);

// ➤ Delete doctor by ID
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;
