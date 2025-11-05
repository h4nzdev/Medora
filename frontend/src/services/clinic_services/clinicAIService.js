import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/clinic-ai`;

// ✅ CRITICAL: Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

// Main clinic AI chat
export const chatWithClinicAI = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Error chatting with Clinic AI:", error);
    throw error;
  }
};

// Get clinic analytics for AI context
export const getClinicAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinic analytics:", error);
    throw error;
  }
};

// Test clinic AI connection
export const testClinicAIConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error("Error testing Clinic AI connection:", error);
    throw error;
  }
};

// Get appointment statistics (if you want separate endpoint)
export const getAppointmentStats = async (timeframe = "today") => {
  try {
    const response = await axios.get(`${API_URL}/appointments/stats`, {
      params: { timeframe },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    throw error;
  }
};

// Utility function to check if user is clinic staff
export const isClinicUser = (user) => {
  return user && user.role === "Clinic";
};

// Utility function to format clinic data for display
export const formatClinicInsights = (clinicData) => {
  if (!clinicData) return null;

  return {
    todaysAppointments: clinicData.basic_stats?.todays_appointments || 0,
    pendingAppointments:
      clinicData.basic_stats?.appointment_status?.pending || 0,
    scheduledAppointments:
      clinicData.basic_stats?.appointment_status?.scheduled || 0,
    completedAppointments:
      clinicData.basic_stats?.appointment_status?.completed || 0,
    totalDoctors: clinicData.basic_stats?.total_doctors || 0,
    clinicName: clinicData.clinic_name || "Your Clinic",
  };
};
