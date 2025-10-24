import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth/patient`;

// Send password change verification email
export const sendPasswordChangeVerification = async (
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
    console.error("Error sending password verification:", error);
    throw error;
  }
};

// Verify code and change password
export const verifyAndChangePassword = async (
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
    console.error("Error changing password:", error);
    throw error;
  }
};

// Simple password change (without verification - for admin or internal use)
export const changePassword = async (userId, newPassword) => {
  try {
    const response = await axios.patch(`${API_URL}/change-password/${userId}`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Check password strength (client-side validation)
export const validatePasswordStrength = (password) => {
  const validations = {
    length: password.length >= 6,
    firstLetterUppercase: /^[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  };

  const isValid = Object.values(validations).every(Boolean);

  return {
    isValid,
    validations,
    score: Object.values(validations).filter(Boolean).length,
  };
};

// Generate random temporary password
export const generateTemporaryPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  // Ensure first character is uppercase
  password += chars.charAt(Math.floor(Math.random() * 26));

  // Add remaining characters
  for (let i = 1; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};
