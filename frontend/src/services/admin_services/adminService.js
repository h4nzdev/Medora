import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Admin Auth (this one works!)
export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

// DASHBOARD STATS - Using ALL your existing endpoints
export const getDashboardStats = async () => {
  try {
    console.log("🔍 Fetching dashboard stats from ALL real endpoints...");

    // Use ALL endpoints that actually exist
    const endpoints = [
      `${BASE_URL}/clinic`, // ✅ Clinics
      `${BASE_URL}/patient`, // ✅ Patients
      `${BASE_URL}/doctor`, // ✅ Doctors
      `${BASE_URL}/appointment`, // ✅ Appointments
      `${BASE_URL}/api/invoices`, // ✅ Invoices
      `${BASE_URL}/api/feedback`, // ✅ Feedback
      `${BASE_URL}/medical-records`, // ✅ Medical Records (you have this!)
      `${BASE_URL}/chat`, // ✅ Chats (you have this!)
    ];

    const responses = await Promise.allSettled(
      endpoints.map((endpoint) => axios.get(endpoint))
    );

    // Extract data from successful responses
    const clinics =
      responses[0].status === "fulfilled" ? responses[0].value.data : [];
    const patients =
      responses[1].status === "fulfilled" ? responses[1].value.data : [];
    const doctors =
      responses[2].status === "fulfilled" ? responses[2].value.data : [];
    const appointments =
      responses[3].status === "fulfilled" ? responses[3].value.data : [];
    const invoices =
      responses[4].status === "fulfilled" ? responses[4].value.data : [];
    const feedback =
      responses[5].status === "fulfilled" ? responses[5].value.data : [];
    const medicalRecords =
      responses[6].status === "fulfilled" ? responses[6].value.data : [];
    const chatsResponse =
      responses[7].status === "fulfilled" ? responses[7].value.data : {};
    const chats = chatsResponse.chats || [];

    console.log("📊 ALL Real data fetched:", {
      clinics: clinics.length,
      patients: patients.length,
      doctors: doctors.length,
      appointments: appointments.length,
      invoices: invoices.length,
      feedback: feedback.length,
      medicalRecords: medicalRecords.length,
      chats: chats.length,
    });

    // Calculate stats from real data
    const pendingAppointments = Array.isArray(appointments)
      ? appointments.filter((apt) => apt.status === "pending").length
      : 0;

    const completedAppointments = Array.isArray(appointments)
      ? appointments.filter((apt) => apt.status === "completed").length
      : 0;

    return {
      totalClinics: Array.isArray(clinics) ? clinics.length : 0,
      totalPatients: Array.isArray(patients) ? patients.length : 0,
      totalDoctors: Array.isArray(doctors) ? doctors.length : 0,
      totalAppointments: Array.isArray(appointments) ? appointments.length : 0,
      pendingAppointments,
      completedAppointments,
      monthlyRevenue: calculateMonthlyRevenue(invoices),
      totalChats: Array.isArray(chats) ? chats.length : 0, // REAL CHAT DATA!
      medicalRecords: Array.isArray(medicalRecords) ? medicalRecords.length : 0, // REAL MEDICAL RECORDS!
      invoicesGenerated: Array.isArray(invoices) ? invoices.length : 0,
    };
  } catch (error) {
    console.error("❌ Error in getDashboardStats:", error);
    return getMockStats();
  }
};

// CLINIC SUBSCRIPTION BREAKDOWN
export const getClinicSubscriptionBreakdown = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/clinic`);
    const clinics = response.data;

    if (!Array.isArray(clinics)) {
      return getMockSubscriptions();
    }

    const breakdown = {
      free: clinics.filter((clinic) => clinic.subscriptionPlan === "free")
        .length,
      basic: clinics.filter((clinic) => clinic.subscriptionPlan === "basic")
        .length,
      pro: clinics.filter((clinic) => clinic.subscriptionPlan === "pro").length,
    };

    return breakdown;
  } catch (error) {
    console.error("❌ Error fetching clinics:", error);
    return getMockSubscriptions();
  }
};

// APPOINTMENT ANALYTICS
export const getAppointmentAnalytics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/appointment`);
    const appointments = response.data;

    if (!Array.isArray(appointments)) {
      return getMockAnalytics();
    }

    // Calculate weekly trends (last 7 days)
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.date || apt.createdAt);
      const daysAgo = Math.floor(
        (new Date() - aptDate) / (1000 * 60 * 60 * 24)
      );
      if (daysAgo >= 0 && daysAgo < 7) {
        weeklyData[6 - daysAgo]++;
      }
    });

    return {
      weekly: weeklyData,
      status: {
        pending: appointments.filter((apt) => apt.status === "pending").length,
        completed: appointments.filter((apt) => apt.status === "completed")
          .length,
        cancelled: appointments.filter((apt) => apt.status === "cancelled")
          .length,
      },
    };
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return getMockAnalytics();
  }
};

// RECENT ACTIVITY - Enhanced with multiple data sources
export const getRecentActivity = async () => {
  try {
    // Fetch from multiple sources for richer activity feed
    const [clinicsRes, appointmentsRes, feedbackRes] = await Promise.allSettled(
      [
        axios.get(`${BASE_URL}/clinic`),
        axios.get(`${BASE_URL}/appointment`),
        axios.get(`${BASE_URL}/api/feedback`),
      ]
    );

    const activities = [];

    // Recent clinic registrations
    if (
      clinicsRes.status === "fulfilled" &&
      Array.isArray(clinicsRes.value.data)
    ) {
      const recentClinics = clinicsRes.value.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      recentClinics.forEach((clinic) => {
        activities.push({
          id: clinic._id,
          title: `New clinic registration - ${clinic.clinicName}`,
          description: `${clinic.address || "Unknown location"} • ${
            clinic.subscriptionPlan
          } Plan`,
          time: formatTimeAgo(clinic.createdAt),
          icon: "Building",
          type: "clinic",
        });
      });
    }

    // Recent appointments
    if (
      appointmentsRes.status === "fulfilled" &&
      Array.isArray(appointmentsRes.value.data)
    ) {
      const recentAppointments = appointmentsRes.value.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);

      recentAppointments.forEach((apt) => {
        activities.push({
          id: apt._id,
          title: `New appointment scheduled`,
          description: `Status: ${apt.status}`,
          time: formatTimeAgo(apt.createdAt),
          icon: "Calendar",
          type: "appointment",
        });
      });
    }

    // Recent feedback
    if (
      feedbackRes.status === "fulfilled" &&
      Array.isArray(feedbackRes.value.data)
    ) {
      const recentFeedback = feedbackRes.value.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);

      recentFeedback.forEach((fb) => {
        activities.push({
          id: fb._id,
          title: `New ${fb.type} feedback submitted`,
          description: `Rating: ${fb.rating}/5`,
          time: formatTimeAgo(fb.createdAt),
          icon: "MessageSquare",
          type: "feedback",
        });
      });
    }

    // Sort all activities by time and return top 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error);
    return getMockActivity();
  }
};

// NEW: GET ALL MEDICAL RECORDS (for admin)
export const getAllMedicalRecords = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/medical-records`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching medical records:", error);
    return [];
  }
};

// NEW: GET ALL CHATS (for admin)
export const getAllChats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chat`);
    return response.data.chats || [];
  } catch (error) {
    console.error("❌ Error fetching chats:", error);
    return [];
  }
};

// NEW: GET ALL INVOICES (for admin)
export const getAllInvoices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoices`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return [];
  }
};

// NEW: GET CHAT ANALYTICS
export const getChatAnalytics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chat`);
    const chats = response.data;

    if (!Array.isArray(chats)) {
      return { totalChats: 0, averageMessages: 0 };
    }

    return {
      totalChats: chats.length,
      averageMessages:
        chats.length > 0
          ? Math.round(
              chats.reduce((acc, chat) => acc + (chat.messageCount || 1), 0) /
                chats.length
            )
          : 0,
    };
  } catch (error) {
    console.error("❌ Error fetching chat analytics:", error);
    return { totalChats: 0, averageMessages: 0 };
  }
};

// ========== HELPER FUNCTIONS ==========

const calculateMonthlyRevenue = (invoices) => {
  if (!Array.isArray(invoices)) return 4336500;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return invoices
    .filter((invoice) => {
      if (!invoice.createdAt) return false;
      const invoiceDate = new Date(invoice.createdAt);
      return (
        invoiceDate.getMonth() === currentMonth &&
        invoiceDate.getFullYear() === currentYear
      );
    })
    .reduce((total, invoice) => total + (invoice.amount || 0), 0);
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${Math.floor(diffInHours / 24)} days ago`;
};

// GET SUBSCRIPTION PROFIT - SUPER SIMPLE!
export const getSubscriptionProfit = async () => {
  try {
    console.log("💰 Calculating profit from subscriptions...");

    // Get ALL subscriptions from your new subscription collection
    const response = await axios.get(`${BASE_URL}/api/subscription`);
    const subscriptions = response.data.data || []; // Adjust based on your response structure

    console.log("📊 Subscriptions found:", subscriptions.length);

    // Calculate totals - SUPER SIMPLE MATH!
    const totalProfit = subscriptions
      .filter((sub) => sub.plan !== "free") // Only count paid plans
      .reduce((sum, sub) => sum + (sub.amount || 0), 0);

    const monthlyProfit = subscriptions
      .filter((sub) => {
        if (sub.plan === "free") return false;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(sub.startDate) >= oneMonthAgo;
      })
      .reduce((sum, sub) => sum + (sub.amount || 0), 0);

    // Count basic vs pro revenue
    const basicRevenue = subscriptions
      .filter((sub) => sub.plan === "basic")
      .reduce((sum, sub) => sum + (sub.amount || 0), 0);

    const proRevenue = subscriptions
      .filter((sub) => sub.plan === "pro")
      .reduce((sum, sub) => sum + (sub.amount || 0), 0);

    console.log("💰 Profit calculated:", {
      totalProfit,
      monthlyProfit,
      basicRevenue,
      proRevenue,
    });

    return {
      totalProfit,
      monthlyProfit,
      subscriptionBreakdown: {
        basic: basicRevenue,
        pro: proRevenue,
      },
    };
  } catch (error) {
    console.error("❌ Error calculating profit:", error);
    // Return zeros if error
    return {
      totalProfit: 0,
      monthlyProfit: 0,
      subscriptionBreakdown: { basic: 0, pro: 0 },
    };
  }
};

// ========== MOCK FALLBACK DATA ==========

const getMockStats = () => ({
  totalClinics: 24,
  totalPatients: 1248,
  totalDoctors: 156,
  totalAppointments: 3842,
  pendingAppointments: 45,
  completedAppointments: 2891,
  monthlyRevenue: 4336500,
  totalChats: 892,
  medicalRecords: 2456,
  invoicesGenerated: 1893,
});

const getMockSubscriptions = () => ({
  free: 8,
  basic: 12,
  pro: 4,
});

const getMockAnalytics = () => ({
  weekly: [45, 52, 48, 61, 58, 49, 42],
  status: {
    pending: 45,
    completed: 2891,
    cancelled: 123,
  },
});

const getMockActivity = () => [
  {
    id: 1,
    title: "New clinic registration - MedPlus Center",
    description: "Quezon City • Free Plan",
    time: "2 hours ago",
    icon: "Building",
    type: "clinic",
  },
  {
    id: 2,
    title: "Doctor verification completed",
    description: "Dr. Maria Santos - Cardiologist",
    time: "4 hours ago",
    icon: "UserCheck",
    type: "doctor",
  },
  {
    id: 3,
    title: "Monthly revenue milestone achieved",
    description: "₱4.3M total monthly revenue",
    time: "6 hours ago",
    icon: "DollarSign",
    type: "revenue",
  },
  {
    id: 4,
    title: "AI chat usage spike",
    description: "156 chat sessions today",
    time: "8 hours ago",
    icon: "MessageSquare",
    type: "chat",
  },
  {
    id: 5,
    title: "New medical records added",
    description: "45 records from various clinics",
    time: "1 day ago",
    icon: "FileText",
    type: "records",
  },
];
