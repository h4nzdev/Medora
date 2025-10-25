import React from "react";
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
} from "lucide-react";

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
  // Static data based on Medora project structure
  const dashboardStats = {
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

  const clinicPlans = {
    free: 8,
    basic: 12,
    pro: 4,
  };

  const recentActivity = [
    {
      id: 1,
      title: "New clinic registration - MedPlus Center",
      description: "Quezon City • Free Plan",
      time: "2 hours ago",
      icon: Building,
      type: "clinic",
    },
    {
      id: 2,
      title: "Doctor verification completed",
      description: "Dr. Maria Santos - Cardiologist",
      time: "4 hours ago",
      icon: UserCheck,
      type: "doctor",
    },
    {
      id: 3,
      title: "Monthly revenue milestone achieved",
      description: "₱4.3M total monthly revenue",
      time: "6 hours ago",
      icon: DollarSign,
      type: "revenue",
    },
    {
      id: 4,
      title: "AI chat usage spike",
      description: "156 chat sessions today",
      time: "8 hours ago",
      icon: MessageSquare,
      type: "chat",
    },
    {
      id: 5,
      title: "New medical records added",
      description: "45 records from various clinics",
      time: "1 day ago",
      icon: FileText,
      type: "records",
    },
  ];

  const quickStats = [
    {
      title: "Active Clinics",
      value: dashboardStats.totalClinics,
      icon: Building,
      color: "bg-blue-500",
      description: "Registered healthcare facilities",
    },
    {
      title: "Total Patients",
      value: dashboardStats.totalPatients.toLocaleString(),
      icon: Users,
      color: "bg-green-500",
      description: "Registered patients across all clinics",
    },
    {
      title: "Medical Doctors",
      value: dashboardStats.totalDoctors,
      icon: Stethoscope,
      color: "bg-purple-500",
      description: "Verified healthcare professionals",
    },
    {
      title: "AI Chat Sessions",
      value: dashboardStats.totalChats,
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
            value={dashboardStats.totalAppointments.toLocaleString()}
            icon={Calendar}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₱${(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M`}
            subtitle="From all clinics"
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend={15}
          />
          <StatCard
            title="Pending Approvals"
            value={dashboardStats.pendingAppointments}
            icon={Activity}
            color="bg-gradient-to-br from-amber-500 to-amber-600"
            trend={-5}
          />
          <StatCard
            title="Completed Sessions"
            value={dashboardStats.completedAppointments.toLocaleString()}
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
                {[45, 52, 48, 61, 58, 49, 42].reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <BarChart data={[45, 52, 48, 61, 58, 49, 42]} color="bg-cyan-500" />
            <div className="flex justify-between mt-4 text-sm text-slate-600">
              <span>Pending: {dashboardStats.pendingAppointments}</span>
              <span>Completed: {dashboardStats.completedAppointments}</span>
              <span>Total: {dashboardStats.totalAppointments}</span>
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
                    {clinicPlans.free} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{
                      width: `${
                        (clinicPlans.free / dashboardStats.totalClinics) * 100
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
                    {clinicPlans.basic} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (clinicPlans.basic / dashboardStats.totalClinics) * 100
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
                    {clinicPlans.pro} clinics
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (clinicPlans.pro / dashboardStats.totalClinics) * 100
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
                  {dashboardStats.totalClinics}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Monthly Revenue:</span>
                <span className="font-semibold text-slate-800">
                  ₱{(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M
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
                      {dashboardStats.medicalRecords.toLocaleString()}
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
                      {dashboardStats.invoicesGenerated.toLocaleString()}
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
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <activity.icon className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {activity.time}
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
