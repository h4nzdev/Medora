import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  UserCheck,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Shield,
  Stethoscope,
  FileText,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  getDashboardStats,
  getAppointmentAnalytics,
  getClinicSubscriptionBreakdown,
  getRecentActivity,
  getAllChats,
} from "../../../services/admin_services/adminService";

// Simple chart components
const BarChart = ({ data, color = "bg-cyan-500" }) => (
  <div className="flex items-end justify-between h-32 mt-4 space-x-1">
    {data.map((value, index) => (
      <div key={index} className="flex flex-col items-center flex-1">
        <div
          className={`w-full ${color} rounded-t-lg`}
          style={{ height: `${(value / Math.max(...data)) * 80}%` }}
        ></div>
        <span className="text-xs text-slate-500 mt-1">
          {["M", "T", "W", "T", "F", "S", "S"][index]}
        </span>
      </div>
    ))}
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    analytics: null,
    subscriptions: null,
    activity: null,
  });

  // Fetch real data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, analytics, subscriptions, activity, chats] =
        await Promise.all([
          getDashboardStats(),
          getAppointmentAnalytics(),
          getClinicSubscriptionBreakdown(),
          getRecentActivity(),
          getAllChats(),
        ]);

      console.log("🔍 DEBUG - Real Stats Data:", stats);
      console.log("📊 Chats:", stats.totalChats);
      console.log("📄 Medical Records:", stats.medicalRecords);
      console.log("🧾 Invoices:", stats.invoicesGenerated);

      setDashboardData({
        stats,
        analytics,
        subscriptions,
        activity,
        chats,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use real data or fallback to mock data while loading
  const stats = dashboardData.stats || {
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
  };

  const subscriptions = dashboardData.subscriptions;

  const analytics = dashboardData.analytics;

  const activity = dashboardData.activity;

  const quickStats = [
    {
      title: "Active Clinics",
      value: stats.totalClinics,
      icon: Building,
      color: "bg-blue-500",
      description: "Registered healthcare facilities",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients.toLocaleString(),
      icon: Users,
      color: "bg-green-500",
      description: "Registered patients across all clinics",
    },
    {
      title: "Medical Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "bg-purple-500",
      description: "Verified healthcare professionals",
    },
    {
      title: "AI Chat Sessions",
      value: stats.totalChats,
      icon: MessageSquare,
      color: "bg-cyan-500",
      description: "Total Gemini AI interactions",
    },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          <div className="flex items-center mt-1">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              {trend}% from last month
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {subtitle && <p className="text-slate-500 text-sm mt-2">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Medora Admin Dashboard
              </h1>
              <p className="text-slate-600">
                Overview of your healthcare platform management system
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">System Admin</p>
                  <p className="text-slate-500 text-sm">Medora Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments.toLocaleString()}
            icon={Calendar}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₱${(stats.monthlyRevenue / 1000000).toFixed(1)}M`}
            subtitle="From all clinics"
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend={15}
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingAppointments}
            icon={Activity}
            color="bg-gradient-to-br from-amber-500 to-amber-600"
            trend={-5}
          />
          <StatCard
            title="Completed Sessions"
            value={stats.completedAppointments.toLocaleString()}
            icon={UserCheck}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend={8}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointments Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Weekly Appointments
              </h2>
              <div className="text-2xl font-bold text-slate-800">
                {analytics.weekly.reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <BarChart data={analytics.weekly} color="bg-cyan-500" />
            <div className="flex justify-between mt-4 text-sm text-slate-600">
              <span>Pending: {analytics.status.pending}</span>
              <span>Completed: {analytics.status.completed}</span>
              <span>Total: {stats.totalAppointments}</span>
            </div>
          </div>

          {/* Clinic Subscription Plans */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Clinic Subscription Plans
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    Free Plan
                  </span>
                  <span className="text-sm text-slate-600">
                    {subscriptions.free} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{
                      width: `${
                        (subscriptions.free / stats.totalClinics) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    Basic Plan
                  </span>
                  <span className="text-sm text-slate-600">
                    {subscriptions.basic} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (subscriptions.basic / stats.totalClinics) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    Pro Plan
                  </span>
                  <span className="text-sm text-slate-600">
                    {subscriptions.pro} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (subscriptions.pro / stats.totalClinics) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Clinics:</span>
                <span className="font-semibold text-slate-800">
                  {stats.totalClinics}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Monthly Revenue:</span>
                <span className="font-semibold text-slate-800">
                  ₱{(stats.monthlyRevenue / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Platform Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Platform Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${stat.color} rounded-lg`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">
                        {stat.value}
                      </p>
                      <p className="text-slate-800 text-sm font-medium">
                        {stat.title}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {stats.medicalRecords.toLocaleString()}
                    </p>
                    <p className="text-slate-600 text-sm">Medical Records</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {stats.invoicesGenerated.toLocaleString()}
                    </p>
                    <p className="text-slate-600 text-sm">Invoices Generated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activity.map((activityItem) => (
                <div
                  key={activityItem.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <activityItem.icon className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">
                      {activityItem.title}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {activityItem.description}
                    </p>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {activityItem.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
