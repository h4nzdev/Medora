import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

// Comprehensive analytics service
export const getComprehensiveAnalytics = async () => {
  try {
    const [stats, trends, revenue, platform] = await Promise.all([
      axios.get(`${API_URL}/dashboard/stats`),
      axios.get(`${API_URL}/appointments/trends`),
      axios.get(`${API_URL}/finance/revenue`),
      axios.get(`${API_URL}/platform/metrics`),
    ]);

    return {
      stats: stats.data,
      trends: trends.data,
      revenue: revenue.data,
      platform: platform.data,
    };
  } catch (error) {
    console.error("Error fetching comprehensive analytics:", error);
    throw error;
  }
};

// Real-time dashboard data
export const getRealTimeDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/real-time`);
    return response.data;
  } catch (error) {
    console.error("Error fetching real-time dashboard:", error);
    throw error;
  }
};
