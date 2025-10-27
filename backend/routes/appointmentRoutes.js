import express from "express";
import {
  addAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  respondToAppointment,
  getAppointmentsByPatientId,
  cancelExpiredAppointments,
} from "../controller/appointmentController.js";

const appointmentRouter = express.Router();

// Create a new appointment
appointmentRouter.post("/add-appointment", addAppointment);

// Get all appointments
appointmentRouter.get("/", getAppointments);

// Get a single appointment by ID
appointmentRouter.get("/:id", getAppointmentById);

// Update appointment (status, date, or time)
appointmentRouter.put("/:id", updateAppointment);

// Delete appointment (cancel)
appointmentRouter.delete("/:id", deleteAppointment);

//Clinic accept/reject appointment
appointmentRouter.patch("/respond/:id", respondToAppointment);

//
appointmentRouter.get("/patient/:patientId", getAppointmentsByPatientId);

appointmentRouter.patch("/cancel-expired", cancelExpiredAppointments);

export default appointmentRouter;
