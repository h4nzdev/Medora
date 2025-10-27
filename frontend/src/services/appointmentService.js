import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/appointment`; // Your backend's URL

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-appointment`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    throw error;
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with id ${id}:`, error);
    throw error;
  }
};

// Update an existing appointment
export const updateAppointment = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment with id ${id}:`, error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting appointment with id ${id}:`, error);
    throw error;
  }
};

// Clinic respond to appointment (approve/reject)
export const respondToAppointment = async (id, action) => {
  try {
    const response = await axios.patch(`${API_URL}/respond/${id}`, { action });
    return response.data;
  } catch (error) {
    console.error(`Error responding to appointment with id ${id}:`, error);
    throw error;
  }
};

// Get all appointments for a specific patient
export const getAppointmentsByPatient = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching appointments for patient ${patientId}:`,
      error
    );
    throw error;
  }
};

// services/appointmentService.js - Add this function
export const cancelExpiredAppointments = async () => {
  try {
    const response = await axios.patch(`${API_URL}/cancel-expired`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling expired appointments:", error);
    throw error;
  }
};

// Call this when app loads or periodically
// cancelExpiredAppointments();
