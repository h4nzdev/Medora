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

// Import services
import {
  getDashboardStats,
  getAppointmentAnalytics,
  getClinicSubscriptionBreakdown,
  getRecentActivity,
  getAllChats,
  getSubscriptionProfit,
} from "../../../services/admin_services/adminService";

// Simple chart component
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
  // SIMPLE STATES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store all data in simple variables
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [subscriptions, setSubscriptions] = useState({});
  const [activity, setActivity] = useState([]);
  const [profit, setProfit] = useState({});

  // SIMPLE DATA FETCHING
  useEffect(() => {
    fetchData();
  }, []);

  // EASY-TO-UNDERSTAND FUNCTION
  const fetchData = async () => {
    try {
      setLoading(true);

      // Get all data at once
      const allData = await Promise.all([
        getDashboardStats(),
        getAppointmentAnalytics(),
        getClinicSubscriptionBreakdown(),
        getRecentActivity(),
        getAllChats(),
        getSubscriptionProfit(),
      ]);

      // Set data to states - very clear!
      setStats(allData[0]);
      setAnalytics(allData[1]);
      setSubscriptions(allData[2]);
      setActivity(allData[3]);
      setProfit(allData[5]); // profit is the 6th item
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // SIMPLE STAT CARD
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

  // SIMPLE LOADING
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

  // SIMPLE ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // SIMPLE QUICK STATS DATA
  const quickStats = [
    {
      title: "Active Clinics",
      value: stats.totalClinics || 0,
      icon: Building,
      color: "bg-blue-500",
      description: "Registered healthcare facilities",
    },
    {
      title: "Total Patients",
      value: (stats.totalPatients || 0).toLocaleString(),
      icon: Users,
      color: "bg-green-500",
      description: "Registered patients across all clinics",
    },
    {
      title: "Medical Doctors",
      value: stats.totalDoctors || 0,
      icon: Stethoscope,
      color: "bg-purple-500",
      description: "Verified healthcare professionals",
    },
    {
      title: "AI Chat Sessions",
      value: stats.totalChats || 0,
      icon: MessageSquare,
      color: "bg-cyan-500",
      description: "Total Gemini AI interactions",
    },
  ];

  // YOUR EXACT SAME UI FROM BEFORE - JUST SIMPLER DATA HANDLING! 🎯
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header - Same as before */}
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

        {/* Main Stats Grid - Same UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Appointments"
            value={(stats.totalAppointments || 0).toLocaleString()}
            icon={Calendar}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₱${profit.monthlyProfit || 0}`}
            subtitle="From subscription payments"
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend={15}
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingAppointments || 0}
            icon={Activity}
            color="bg-gradient-to-br from-amber-500 to-amber-600"
            trend={-5}
          />
          <StatCard
            title="Completed Sessions"
            value={(stats.completedAppointments || 0).toLocaleString()}
            icon={UserCheck}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend={8}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointments Overview - Same UI */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Weekly Appointments
              </h2>
              <div className="text-2xl font-bold text-slate-800">
                {(analytics.weekly || []).reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <BarChart
              data={analytics.weekly || [0, 0, 0, 0, 0, 0, 0]}
              color="bg-cyan-500"
            />
            <div className="flex justify-between mt-4 text-sm text-slate-600">
              <span>Pending: {analytics.status?.pending || 0}</span>
              <span>Completed: {analytics.status?.completed || 0}</span>
              <span>Total: {stats.totalAppointments || 0}</span>
            </div>
          </div>

          {/* Clinic Subscription Plans - Same UI */}
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
                    {subscriptions.free || 0} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{
                      width: `${
                        ((subscriptions.free || 0) /
                          (stats.totalClinics || 1)) *
                        100
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
                    {subscriptions.basic || 0} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((subscriptions.basic || 0) /
                          (stats.totalClinics || 1)) *
                        100
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
                    {subscriptions.pro || 0} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((subscriptions.pro || 0) / (stats.totalClinics || 1)) *
                        100
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
                  {stats.totalClinics || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Subscription Revenue:</span>
                <span className="font-semibold text-green-600">
                  ₱{profit.totalProfit || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your UI exactly the same */}
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
                      {(stats.medicalRecords || 0).toLocaleString()}
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
                      {(stats.invoicesGenerated || 0).toLocaleString()}
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
              {(activity || []).map((activityItem, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
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
