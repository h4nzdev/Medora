import axios from "axios";

const CLINIC_API_URL = `${import.meta.env.VITE_API_URL}/clinic`;

// Get all clinics (for admin)
export const getAllClinics = async () => {
  try {
    const response = await axios.get(CLINIC_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinics:", error);
    throw error;
  }
};

// Get clinic by ID
export const getClinicById = async (clinicId) => {
  try {
    const response = await axios.get(`${CLINIC_API_URL}/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinic:", error);
    throw error;
  }
};

// Update clinic
export const updateClinic = async (clinicId, updateData) => {
  try {
    const response = await axios.put(
      `${CLINIC_API_URL}/${clinicId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating clinic:", error);
    throw error;
  }
};

// Delete clinic
export const deleteClinic = async (clinicId) => {
  try {
    const response = await axios.delete(`${CLINIC_API_URL}/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting clinic:", error);
    throw error;
  }
};

// Update subscription plan
export const updateClinicSubscription = async (clinicId, plan) => {
  try {
    const response = await axios.put(
      `${CLINIC_API_URL}/${clinicId}/subscription`,
      { plan }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};

export const updateClinicStatus = async (clinicId, status) => {
  try {
    const response = await axios.put(`${CLINIC_API_URL}/${clinicId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating clinic status:", error);
    throw error;
  }
};
