import express from "express";
import {
  getAllClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
  updateSubscriptionPlan,
  updateClinicStatus,
} from "../controller/clinicController.js";

const clinicRouter = express.Router();

// ✅ Get all clinics
clinicRouter.get("/", getAllClinics);

// ✅ Get a clinic by ID
clinicRouter.get("/:id", getClinicById);

// ✅ Update clinic details
clinicRouter.put("/:id", updateClinic);

// ✅ Delete a clinic
clinicRouter.delete("/:id", deleteClinic);

//Update the subscription plan
clinicRouter.put("/:id/subscription", updateSubscriptionPlan);

clinicRouter.put("/:id/status", updateClinicStatus);

export default clinicRouter;
