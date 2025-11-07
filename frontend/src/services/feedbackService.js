import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/feedback`;

// Get token from storage
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Submit new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/`, feedbackData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

// Get all feedback (Admin only)
export const getAllFeedback = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    throw error;
  }
};

// Get feedback by type (Admin only)
export const getFeedbackByType = async (type) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/type/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} feedback:`, error);
    throw error;
  }
};

// Get user's own feedback
export const getMyFeedback = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/my-feedback`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's feedback:", error);
    throw error;
  }
};

// Add admin response to feedback (Admin only)
export const addAdminResponse = async (id, responseMessage) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/${id}/response`,
      {
        message: responseMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding response to feedback ${id}:`, error);
    throw error;
  }
};

// Add admin reaction (thumbs up/down) (Admin only)
export const addAdminReaction = async (id, reaction) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/${id}/reaction`,
      {
        reaction,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding reaction to feedback ${id}:`, error);
    throw error;
  }
};

// Update feedback status (Admin only)
export const updateFeedbackStatus = async (id, status) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating feedback status with id ${id}:`, error);
    throw error;
  }
};

// Delete feedback (Admin only)
export const deleteFeedback = async (id) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting feedback with id ${id}:`, error);
    throw error;
  }
};

// Get feedback statistics (Admin only)
export const getFeedbackStats = async () => {
  try {
    const allFeedback = await getAllFeedback();

    const stats = {
      total: allFeedback.length,
      pending: allFeedback.filter((f) => f.status === "pending").length,
      reviewed: allFeedback.filter((f) => f.status === "reviewed").length,
      resolved: allFeedback.filter((f) => f.status === "resolved").length,
      closed: allFeedback.filter((f) => f.status === "closed").length,
      byType: {
        bug: allFeedback.filter((f) => f.type === "bug").length,
        suggestion: allFeedback.filter((f) => f.type === "suggestion").length,
        complaint: allFeedback.filter((f) => f.type === "complaint").length,
        compliment: allFeedback.filter((f) => f.type === "compliment").length,
      },
    };

    return stats;
  } catch (error) {
    console.error("Error calculating feedback stats:", error);
    throw error;
  }
};

// Utility functions
export const ReactionTypes = {
  THUMBS_UP: "thumbs_up",
  THUMBS_DOWN: "thumbs_down",
};

export const StatusTypes = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

export const FeedbackTypes = {
  BUG: "bug",
  SUGGESTION: "suggestion",
  COMPLAINT: "complaint",
  COMPLIMENT: "compliment",
};
