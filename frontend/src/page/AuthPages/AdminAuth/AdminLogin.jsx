"use client";

import {
  Shield,
  Crown,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import logo from "../../../assets/medoralogo.png";
import { useNavigate } from "react-router-dom";
import adminBg from "../../../assets/hanz.jpg"; // You can use a different background
import { toast } from "sonner";

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const adminLoginEndpoint = `${
      import.meta.env.VITE_API_URL
    }/api/admin/login`;

    try {
      const res = await axios.post(adminLoginEndpoint, formData);

      if (res.data.admin && res.data.token) {
        // ✅ IMMEDIATE FIX: Store token directly here
        localStorage.setItem("token", res.data.token); // Since admin always rememberMe=true

        // Then call login function
        login(res.data.admin, res.data.admin.role, true, res.data.token);
        setError(null);
        toast.success("Admin access granted!", {
          icon: <Crown className="w-5 h-5 text-amber-500" />,
        });

        // ✅ TEST: Check if token is stored
        console.log("🔐 Token stored:", localStorage.getItem("token"));
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.error("Access Denied", {
          description: error.response.data.message,
        });
      } else {
        setError("Administrative access failed. Please try again.");
      }
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Admin Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 relative bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${adminBg})` }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-slate-900/80" />

        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-cyan-500/10 rounded-full blur-lg animate-pulse delay-500"></div>

        <div className="flex flex-col justify-center items-center w-full px-12 relative z-10">
          {/* Logo and Brand */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <img
                src={logo}
                className="w-20 h-20 rounded-3xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/30"
                alt="Medora Admin"
              />
              <div className="ml-6 text-left">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Medora
                </h1>
                <p className="text-cyan-200 font-medium tracking-wider">
                  Admin Portal
                </p>
              </div>
            </div>

            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-amber-400" />
                <h2 className="text-3xl font-bold text-white leading-tight">
                  System Administration
                  <br />
                  <span className="text-cyan-300">Control Center</span>
                </h2>
              </div>
              <p className="text-cyan-100 text-lg leading-relaxed max-w-md">
                Manage clinics, monitor system health, and oversee platform
                operations with powerful administrative tools.
              </p>
            </div>
          </div>

          {/* Admin Features */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-cyan-400/30 transition-all duration-300">
              <Settings className="w-8 h-8 text-cyan-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">System</h3>
              <p className="text-cyan-200 text-sm">Management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-blue-400/30 transition-all duration-300">
              <Users className="w-8 h-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">User</h3>
              <p className="text-blue-200 text-sm">Oversight</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-cyan-400/30 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-cyan-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">Analytics</h3>
              <p className="text-cyan-200 text-sm">Dashboard</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-emerald-400/30 transition-all duration-300">
              <Shield className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">Security</h3>
              <p className="text-emerald-200 text-sm">Monitor</p>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="absolute bottom-8 left-12 right-12">
            <p className="text-cyan-300 text-sm text-center flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Restricted Access • Administrative Personnel Only
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Admin Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12 bg-slate-50">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          {/* Mobile Logo - Only shown on smaller screens */}
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <img
                src={logo}
                className="w-16 h-16 rounded-2xl border border-cyan-200"
                alt="Medora Admin"
              />
              <div className="ml-4 text-left">
                <h1 className="text-2xl font-bold text-slate-800">Medora</h1>
                <p className="text-cyan-600 text-sm font-medium">
                  Admin Portal
                </p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-amber-500" />
              <h2 className="text-3xl font-bold text-slate-800">
                Admin Access
              </h2>
            </div>
            <p className="text-slate-600 text-lg">
              Enter your administrative credentials
            </p>
          </div>

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Admin Email
              </label>
              <div className="relative">
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="email"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                  placeholder="admin@medora.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Admin Password
              </label>
              <div className="relative">
                <input
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-4 pr-12 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="border border-red-300 p-4 bg-red-50 flex items-center space-x-3 rounded-2xl">
                <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5" />
                  Access Admin Dashboard
                </span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Secure Administrative Access
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  This portal is monitored and all activities are logged for
                  security purposes. Unauthorized access is strictly prohibited.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex justify-center gap-4 text-sm">
            <button className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
              System Status
            </button>
            <span className="text-slate-400">•</span>
            <button className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
