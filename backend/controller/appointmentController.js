import Appointment from "../model/appointmentModel.js";
import Clinic from "../model/clinicModel.js";
import Patient from "../model/patientsModel.js";
import Doctor from "../model/doctorModel.js";

// Create appointment
export const addAppointment = async (req, res) => {
  try {
    const { clinicId, doctorId, patientId, date, time, type, bookingType } = req.body;

    // check if clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Check subscription plan and appointment limits
    const appointmentCount = await Appointment.countDocuments({ clinicId });
    if (
      clinic.subscriptionPlan === "free" &&
      appointmentCount >= 10
    ) {
      return res.status(403).json({
        message:
          "This clinic has reached its appointment limit for the free plan.",
      });
    } else if (
      clinic.subscriptionPlan === "basic" &&
      appointmentCount >= 20
    ) {
      return res.status(403).json({
        message:
          "This clinic has reached its appointment limit for the basic plan.",
      });
    }

    // check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // create appointment
    const newAppointment = new Appointment({
      clinicId,
      doctorId,
      patientId,
      date,
      time,
      type,
      bookingType,
      status: "pending", // default status
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clinicId", "name plan")
      .populate("doctorId", "name specialty")
      .populate("patientId", "name email phone");

    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("clinicId", "name plan")
      .populate("doctorId", "name specialty")
      .populate("patientId", "name email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointment", error: error.message });
  }
};

// Update appointment (e.g., status or time)
export const updateAppointment = async (req, res) => {
  try {
    const { status, date, time } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, date, time },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: error.message });
  }
};

// Delete appointment (cancel)
export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting appointment", error: error.message });
  }
};

// Clinic Respond (Approve = scheduled, Reject = cancelled)
export const respondToAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { action } = req.body; // we send "approve" or "reject"

    let newStatus;

    if (action === "approve") {
      newStatus = "scheduled";
    } else if (action === "reject") {
      newStatus = "cancelled";
    } else {
      return res
        .status(400)
        .json({ message: "Action must be approve or reject" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: `Appointment ${newStatus}`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};

// Get appointments by Patient ID
export const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params; // get patientId from the route

    // check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // find appointments for this patient
    const appointments = await Appointment.find({ patientId })
      .populate("clinicId", "name plan")
      .populate("doctorId", "name specialty")
      .populate("patientId", "name email phone");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching patient appointments",
      error: error.message,
    });
  }
};
