// services/subscriptionService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/subscription`;

// Create a new subscription
export const createSubscription = async (subscriptionData) => {
  try {
    const response = await axios.post(`${API_URL}/`, subscriptionData);
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

// Get current active subscription for a clinic
export const getClinicSubscription = async (clinicId) => {
  try {
    const response = await axios.get(`${API_URL}/clinic/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscription for clinic ${clinicId}:`, error);
    throw error;
  }
};

// Update subscription status
export const updateSubscription = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    console.log("services:", id + " Data: " +  updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating subscription with id ${id}:`, error);
    throw error;
  }
};

// Get all subscriptions (for admin)
export const getAllSubscriptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all subscriptions:", error);
    throw error;
  }
};
