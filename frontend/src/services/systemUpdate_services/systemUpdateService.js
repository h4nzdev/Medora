import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/system-update`;

// ✅ CRITICAL: Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

// Create new system update
export const createSystemUpdate = async (updateData) => {
  try {
    const response = await axios.post(`${API_URL}/`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error creating system update:", error);
    throw error;
  }
};

// Get all system updates
export const getAllSystemUpdates = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all system updates:", error);
    throw error;
  }
};

// Get system update by ID
export const getSystemUpdateById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching system update ${id}:`, error);
    throw error;
  }
};

// Update system update
export const updateSystemUpdate = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating system update ${id}:`, error);
    throw error;
  }
};

// Delete system update
export const deleteSystemUpdate = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting system update ${id}:`, error);
    throw error;
  }
};

// Publish system update
export const publishSystemUpdate = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing system update ${id}:`, error);
    throw error;
  }
};

// Utility functions for status
export const StatusTypes = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

// Utility functions for priority
export const PriorityTypes = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

// Utility functions for update type
export const UpdateTypes = {
  FEATURE: "feature",
  MAINTENANCE: "maintenance",
  BUG_FIX: "bug-fix",
  ANNOUNCEMENT: "announcement",
  SECURITY: "security",
};
