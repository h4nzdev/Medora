// services/forgotPasswordService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/forgot-password`;

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/request-reset`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

// Verify code and reset password
export const verifyAndResetPassword = async (email, code, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/verify-reset`, {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
