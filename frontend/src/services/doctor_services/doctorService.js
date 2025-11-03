import axios from "axios";

const DOCTOR_API_URL = `${import.meta.env.VITE_API_URL}/doctor`;

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await axios.get(DOCTOR_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Get doctor by ID
export const getDoctorById = async (doctorId) => {
  try {
    const response = await axios.get(`${DOCTOR_API_URL}/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};

// Create new doctor
export const createDoctor = async (doctorData) => {
  try {
    const response = await axios.post(DOCTOR_API_URL, doctorData);
    return response.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
};

// Update doctor
export const updateDoctor = async (doctorId, updateData) => {
  try {
    const response = await axios.put(
      `${DOCTOR_API_URL}/${doctorId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
};

// Delete doctor
export const deleteDoctor = async (doctorId) => {
  try {
    const response = await axios.delete(`${DOCTOR_API_URL}/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};

// Get doctors by clinic ID
export const getDoctorsByClinic = async (clinicId) => {
  try {
    const response = await axios.get(`${DOCTOR_API_URL}/clinic/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors by clinic:", error);
    throw error;
  }
};
