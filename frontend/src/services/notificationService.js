import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/notification`;

// ✅ Create a new notification
export const createNotification = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/add-notification`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error.response?.data || error; // rethrow so frontend can handle
  }
};

// ✅ Get notifications for a specific user
export const getUserNotifications = async (recipientId, recipientType) => {
  try {
    const res = await axios.get(`${API_URL}/${recipientId}/${recipientType}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error.response?.data || error;
  }
};

// ✅ Mark as read
export const markNotificationAsRead = async (id) => {
  try {
    const res = await axios.patch(`${API_URL}/${id}/read`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error.response?.data || error;
  }
};
