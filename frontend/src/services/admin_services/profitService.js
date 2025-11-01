// services/admin_services/profitService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/profits`;

// Get profit statistics
export const getProfitStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profit stats:", error);
    throw error;
  }
};

// Get all profits with details
export const getAllProfits = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all profits:", error);
    throw error;
  }
};
