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

// Get patient by ID
export const getPatientById = async (patientId) => {
  try {
    const response = await axios.get(`${PATIENT_API_URL}/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

// Create new patient
export const createPatient = async (patientData) => {
  try {
    const response = await axios.post(PATIENT_API_URL, patientData);
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

// Update patient
export const updatePatient = async (patientId, updateData) => {
  try {
    const response = await axios.put(
      `${PATIENT_API_URL}/${patientId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating patient:", error);
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

// Get patients by clinic ID
export const getPatientsByClinic = async (clinicId) => {
  try {
    const response = await axios.get(`${PATIENT_API_URL}/clinic/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patients by clinic:", error);
    throw error;
  }
};

export const updatePatientApproval = async (patientId, approval) => {
  try {
    const response = await axios.put(
      `${PATIENT_API_URL}/${patientId}/approval`,
      { approval }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating patient approval:", error);
    throw error;
  }
};
