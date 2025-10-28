import axios from "axios";

const PATIENT_API_URL = `${import.meta.env.VITE_API_URL}/patient`;

// Get all patients
export const getAllPatients = async () => {
  try {
    const response = await axios.get(PATIENT_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

// Delete patient
export const deletePatient = async (patientId) => {
  try {
    const response = await axios.delete(`${PATIENT_API_URL}/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};
