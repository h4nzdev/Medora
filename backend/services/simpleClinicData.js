// services/simpleClinicData.js
import Appointment from "../model/appointmentModel.js";
import Doctor from "../model/doctorModel.js";
import Patient from "../model/patientsModel.js";

// Just get basic numbers - no complex analytics
export const getSimpleClinicData = async (clinicId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Simple counts only
    const todaysAppointments = await Appointment.countDocuments({
      clinicId,
      date: { $gte: today, $lt: tomorrow },
    });

    const totalDoctors = await Doctor.countDocuments({ clinicId });

    const totalPatients = await Patient.countDocuments({ clinicId });

    // Simple appointment status counts
    const pendingAppointments = await Appointment.countDocuments({
      clinicId,
      status: "pending",
    });

    const completedAppointments = await Appointment.countDocuments({
      clinicId,
      status: "completed",
    });

    return {
      todays_appointments: todaysAppointments,
      total_doctors: totalDoctors,
      total_patients: totalPatients,
      pending_appointments: pendingAppointments,
      completed_appointments: completedAppointments,
      last_updated: new Date().toLocaleString(),
    };
  } catch (error) {
    console.error("Simple data error:", error);
    return {
      todays_appointments: 0,
      total_doctors: 0,
      total_patients: 0,
      pending_appointments: 0,
      completed_appointments: 0,
      error: "Failed to fetch data",
    };
  }
};
