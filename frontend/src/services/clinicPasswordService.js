import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth/clinic`;

// Send password change verification email for clinic
export const sendClinicPasswordChangeVerification = async (
  email,
  currentPassword
) => {
  try {
    const response = await axios.post(`${API_URL}/send-password-verification`, {
      email,
      currentPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending clinic password verification:", error);
    throw error;
  }
};

// Verify code and change clinic password
export const verifyAndChangeClinicPassword = async (
  email,
  verificationCode,
  currentPassword,
  newPassword
) => {
  try {
    const response = await axios.post(`${API_URL}/verify-change-password`, {
      email,
      verificationCode,
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing clinic password:", error);
    throw error;
  }
};

// Update clinic password (admin function)
export const updateClinicPassword = async (clinicId, newPassword) => {
  try {
    const response = await axios.patch(
      `${API_URL}/update-password/${clinicId}`,
      {
        newPassword,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating clinic password:", error);
    throw error;
  }
};
