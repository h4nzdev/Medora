import Clinic from "../model/clinicModel.js";
import Doctor from "../model/doctorModel.js";

// Get all clinics
export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().populate("doctors"); // include doctors info
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one clinic by ID
export const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate("doctors");
    if (!clinic) return res.status(404).json({ error: "Clinic not found" });
    res.json(clinic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update clinic info
export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!clinic) return res.status(404).json({ error: "Clinic not found" });
    req.io.emit("clinic_updated");
    res.json({ message: "Clinic updated", clinic });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a clinic
export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) return res.status(404).json({ error: "Clinic not found" });
    req.io.emit("clinic_updated");
    res.json({ message: "Clinic deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a doctor into a clinic (using $push)
export const addDoctorToClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;

    // Step 1: Create new doctor
    const doctor = new Doctor({ ...req.body, clinicId });
    await doctor.save();

    // Step 2: Push doctor _id into clinic
    const clinic = await Clinic.findByIdAndUpdate(
      clinicId,
      { $push: { doctors: doctor._id } },
      { new: true }
    ).populate("doctors");

    if (!clinic) return res.status(404).json({ error: "Clinic not found" });

    req.io.emit("clinic_updated");
    res.status(201).json({ message: "Doctor added to clinic", clinic });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update clinic subscription plan
export const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params; // clinic id from the URL
    const { subscriptionPlan } = req.body; // new plan from the request body

    // find clinic and update subscriptionPlan field
    const clinic = await Clinic.findByIdAndUpdate(
      id,
      { subscriptionPlan: subscriptionPlan },
      { new: true }
    );

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    req.io.emit("clinic_updated");
    res.json({
      message: "Subscription plan updated successfully",
      clinic,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
