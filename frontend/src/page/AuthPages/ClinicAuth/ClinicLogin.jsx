"use client";

import {
  Shield,
  Star,
  Sparkles,
  Eye,
  EyeOff,
  AlertTriangle,
  Stethoscope,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import logo from "../../../assets/medoralogo.png";
import { useNavigate } from "react-router-dom";
import clinic from "../../../assets/clinic.jpg";
import { toast } from "react-toastify";

export default function ClinicLogin() {
  const { setRole, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const loginClinic = `${import.meta.env.VITE_API_URL}/auth/clinic/login`; // Clinic login endpoint
    try {
      const res = await axios.post(loginClinic, {
        ...formData,
        role: "clinic",
      });

      if (res.data.clinic) {
        setRole(res.data.clinic.role);
        setUser(res.data.clinic);
        setError(null);
      } else {
        console.error("Unexpected response from server:", res.data);
      }

      console.log("Login successful for: clinic");
      setFormData({
        email: "",
        password: "",
      });
      toast.success("Logged in successfully");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        toast.warn(error.response.data.message, {
          toastId: "login-error",
        });
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 relative bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${clinic})` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_60%)]" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>

        <div className="flex flex-col justify-center items-center w-full px-12 relative z-10 bg-black/60">
          {/* Logo and Brand */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <img
                src={logo}
                className="w-20 h-20 rounded-3xl shadow-2xl shadow-black/20"
                alt="Medora Logo"
              />
              <div className="ml-6 text-left">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Medora
                </h1>
                <p className="text-cyan-100 font-medium tracking-wider">
                  Healthcare Platform
                </p>
              </div>
            </div>

            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Empowering Healthcare
                <br />
                <span className="text-cyan-200">Providers Worldwide</span>
              </h2>
              <p className="text-cyan-100 text-lg leading-relaxed max-w-md">
                Join thousands of clinics and healthcare professionals who trust
                Medora to streamline their patient care and practice management.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <Shield className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">HIPAA</h3>
              <p className="text-cyan-100 text-sm">Compliant</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <Star className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">1000+</h3>
              <p className="text-cyan-100 text-sm">Trusted Clinics</p>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="absolute bottom-8 left-12 right-12">
            <p className="text-cyan-200 text-sm text-center flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Enterprise-grade security & encryption
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
          </div>
          {/* Mobile Logo - Only shown on smaller screens */}
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <img src={logo} className="w-16 h-16" alt="Medora Logo" />
              <div className="ml-4 text-left">
                <h1 className="text-2xl font-bold text-slate-800">Medora</h1>
                <p className="text-cyan-600 text-sm font-medium">
                  Healthcare Platform
                </p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 text-lg">
              Sign in to your clinic dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="email"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                  placeholder="doctor@clinic.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-4 pr-12 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500/20 focus:ring-2"
                />
                <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Display */}
            {error ? (
              <div className="border border-red-300 p-4 bg-red-50 flex items-center space-x-3 rounded-2xl">
                <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : (
              ""
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  Signing in...
                  <Loader2 className="animate-spin" />
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-300" />
            <span className="px-4 text-xs text-slate-500 font-medium">
              SECURE LOGIN
            </span>
            <div className="flex-1 border-t border-slate-300" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              New to Medora?{" "}
              <a
                href="/clinic/register"
                className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors hover:underline"
              >
                Create your clinic account
              </a>
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant & Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Trusted by 1000+ healthcare providers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
