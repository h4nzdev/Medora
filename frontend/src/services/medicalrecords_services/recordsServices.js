import axios from "axios";

const MEDICAL_RECORDS_API_URL = `${
  import.meta.env.VITE_API_URL
}/medical-record`;

// Get all medical records
export const getAllMedicalRecords = async () => {
  try {
    const response = await axios.get(MEDICAL_RECORDS_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    throw error;
  }
};

// Get medical record by ID
export const getMedicalRecordById = async (recordId) => {
  try {
    const response = await axios.get(`${MEDICAL_RECORDS_API_URL}/${recordId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medical record:", error);
    throw error;
  }
};

// Create new medical record
export const createMedicalRecord = async (recordData) => {
  try {
    const response = await axios.post(MEDICAL_RECORDS_API_URL, recordData);
    return response.data;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
};

// Delete medical record
export const deleteMedicalRecord = async (recordId) => {
  try {
    const response = await axios.delete(
      `${MEDICAL_RECORDS_API_URL}/${recordId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting medical record:", error);
    throw error;
  }
};

// Get medical records by patient ID
export const getMedicalRecordsByPatient = async (patientId) => {
  try {
    const response = await axios.get(
      `${MEDICAL_RECORDS_API_URL}/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records by patient:", error);
    throw error;
  }
};

// Get medical records by clinic ID
export const getMedicalRecordsByClinic = async (clinicId) => {
  try {
    const response = await axios.get(
      `${MEDICAL_RECORDS_API_URL}/clinic/${clinicId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records by clinic:", error);
    throw error;
  }
};
