"use client";

import { useState } from "react";
import { Shield, Star, Check, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "../../../components/ClinicComponents/PaymentModal/PaymentModal";
import logo from "../../../assets/medoralogo.png";
import { useNavigate } from "react-router-dom";
import clinic from "../../../assets/clinic.jpg";

export default function ClinicRegister() {
  const [error, setError] = useState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    subscriptionPlan: "free", // default to free plan
    agreeToTerms: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlanSelect = (plan) => {
    setFormData((prev) => ({
      ...prev,
      subscriptionPlan: plan,
    }));
    // Reset payment setup when changing plans
    if (plan === "free") {
      setIsPaymentSetup(true);
    } else {
      setIsPaymentSetup(false);
      setIsModalOpen(true);
    }
  };

  const handlePaymentSubmit = (bankDetails) => {
    console.log("Bank Details:", bankDetails); // Mock submission
    setIsModalOpen(false);
    setIsPaymentSetup(true);
    toast.success("Payment details saved successfully!");
  };

  const registerClinic = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/clinic/register`,
        formData
      );
      toast.success(res.data.message);
      setFormData({
        clinicName: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        subscriptionPlan: "free",
        agreeToTerms: false,
      });
      navigate("/clinic/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
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
        className="hidden lg:flex lg:w-1/2 fixed top-0 left-0 h-screen bg-cover"
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

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-start justify-center px-6 lg:px-12 py-12 overflow-y-auto h-screen">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
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
              Create Your Clinic Account
            </h2>
            <p className="text-slate-600 text-lg">
              Register your clinic to get started
            </p>
          </div>

          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handlePaymentSubmit}
          />

          {/* Registration Form */}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              registerClinic();
            }}
          >
            {/* Clinic Name & Contact Person */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Clinic Name
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  placeholder="Downtown Medical Center"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Dr. John Smith"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@clinic.com"
                  autoComplete="off"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Clinic Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Medical Drive, City, State 12345"
                className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Choose Your Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`border-2 rounded-2xl p-6 transition-all cursor-pointer ${
                    formData.subscriptionPlan === "free"
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-slate-200 hover:border-cyan-300"
                  }`}
                  onClick={() => handlePlanSelect("free")}
                >
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-800 mb-2">Free</h4>
                    <div className="text-2xl font-bold text-slate-800 mb-2">
                      $0<span className="text-sm font-normal">/month</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Up to 25 patients
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Basic scheduling
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Email support
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-2xl p-6 transition-all cursor-pointer relative ${
                    formData.subscriptionPlan === "basic"
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-slate-200 hover:border-cyan-300"
                  }`}
                  onClick={() => handlePlanSelect("basic")}
                >
                  {formData.subscriptionPlan === "basic" && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">
                        Selected
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-800 mb-2">Basic</h4>
                    <div className="text-2xl font-bold text-slate-800 mb-2">
                      $29<span className="text-sm font-normal">/month</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Up to 100 patients
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Advanced scheduling
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Priority support
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Basic analytics
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-2xl p-6 transition-all cursor-pointer relative ${
                    formData.subscriptionPlan === "pro"
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-slate-200 hover:border-cyan-300"
                  }`}
                  onClick={() => handlePlanSelect("pro")}
                >
                  {formData.subscriptionPlan === "pro" && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">
                        Selected
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-800 mb-2">Pro</h4>
                    <div className="text-2xl font-bold text-slate-800 mb-2">
                      $79<span className="text-sm font-normal">/month</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Unlimited patients
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Full features
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        24/7 support
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-1" />
                        Custom integrations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Agree to Terms */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="ml-2 text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Error Display */}
            {error && (
              <div className="border border-red-300 p-4 bg-red-50 flex items-center space-x-3 rounded-2xl mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-red-500 w-5 h-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                (formData.subscriptionPlan !== "free" && !isPaymentSetup) ||
                isLoading
              }
              className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 ${
                formData.subscriptionPlan !== "free" && !isPaymentSetup
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              title={
                formData.subscriptionPlan !== "free" && !isPaymentSetup
                  ? "Please set up payment first"
                  : ""
              }
            >
              {isLoading ? (
                <>
                  Creating Account... <Loader2 className="animate-spin" />
                </>
              ) : (
                "Create Account"
              )}
            </button>
            {formData.subscriptionPlan !== "free" && !isPaymentSetup && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Please set up payment details before creating your account
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-300" />
            <span className="px-4 text-xs text-slate-500 font-medium">
              SECURE REGISTRATION
            </span>
            <div className="flex-1 border-t border-slate-300" />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="/clinic/login"
                className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Trust Indicators */}
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
