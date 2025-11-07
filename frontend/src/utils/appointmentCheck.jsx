// utils/appointmentCheck.js
import { getAppointmentsByPatient } from "../services/appointmentService";

export const checkPendingAppointment = async (patientId, doctorId) => {
  try {
    // Get all appointments for this patient
    const appointments = await getAppointmentsByPatient(patientId);

    const hasPending = appointments.some(
      (appointment) =>
        appointment.patientId?._id === patientId &&
        appointment.doctorId?._id === doctorId &&
        appointment.status === "pending"
    );

    return hasPending;
  } catch (error) {
    console.error("Error checking pending appointment:", error);
    return false;
  }
};
