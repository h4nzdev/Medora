import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/notification`;

// ✅ Create a new notification
export const createNotification = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/add-notification`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error.response?.data || error;
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

// ✅ Get system-wide notifications (admin view)
export const getSystemNotifications = async () => {
  try {
    const res = await axios.get(`${API_URL}/system/all`);
    return res.data;
  } catch (error) {
    console.error("Error fetching system notifications:", error);
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

// ✅ Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (
  recipientId,
  recipientType
) => {
  try {
    const res = await axios.put(`${API_URL}/mark-all-read`, {
      recipientId,
      recipientType,
    });
    return res.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error.response?.data || error;
  }
};

// ✅ Delete a single notification
export const deleteNotification = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error.response?.data || error;
  }
};

// ✅ Delete all notifications for a user
export const deleteAllNotifications = async (recipientId, recipientType) => {
  try {
    const res = await axios.delete(`${API_URL}/user/all`, {
      data: { recipientId, recipientType },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error.response?.data || error;
  }
};
