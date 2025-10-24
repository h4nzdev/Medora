import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/feedback`; // Your backend's URL

// Submit new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_URL}/`, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

// Get all feedback
export const getAllFeedback = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    throw error;
  }
};

// Get feedback by type
export const getFeedbackByType = async (type) => {
  try {
    const response = await axios.get(`${API_URL}/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} feedback:`, error);
    throw error;
  }
};

// Get single feedback by ID
export const getFeedbackById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching feedback with id ${id}:`, error);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting feedback with id ${id}:`, error);
    throw error;
  }
};

// Update feedback status
export const updateFeedbackStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating feedback status with id ${id}:`, error);
    throw error;
  }
};
