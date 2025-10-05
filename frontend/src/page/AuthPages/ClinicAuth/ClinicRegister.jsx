"use client";

import { useState } from "react";
import {
  Shield,
  Star,
  Check,
  ArrowLeft,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
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

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [clinicPicture, setClinicPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 6,
      firstLetterUppercase: /^[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "password") {
      validatePassword(value);
      // Show validation when user starts typing
      if (value.length > 0) {
        setShowPasswordValidation(true);
      } else {
        setShowPasswordValidation(false);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClinicPicture(file);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);

  const handleProceedToVerification = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Client-side validation
    if (!allPasswordRequirementsMet) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms");
      return;
    }

    if (formData.subscriptionPlan !== "free" && !isPaymentSetup) {
      toast.error("Please set up payment details first");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/clinic/send-verification`,
        { email: formData.email }
      );
      toast.success(res.data.message);
      setIsVerificationStep(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const finalFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      finalFormData.append(key, formData[key]);
    });
    finalFormData.append("verificationCode", verificationInput);
    if (clinicPicture) {
      finalFormData.append("clinicPicture", clinicPicture);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/clinic/register`,
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message);
      // Reset form state
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
      setClinicPicture(null);
      setPicturePreview(null);
      setVerificationInput("");
      setIsVerificationStep(false);
      navigate("/clinic/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div
      className={`flex items-center space-x-2 transition-colors duration-200 ${
        isValid ? "text-green-600" : "text-red-500"
      }`}
    >
      {isValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 fixed top-0 left-0 h-screen bg-cover"
        style={{ backgroundImage: `url(${clinic})` }}
      >
        {/* ... (branding elements remain the same) ... */}
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
              onClick={() =>
                isVerificationStep ? setIsVerificationStep(false) : navigate(-1)
              }
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
              {isVerificationStep
                ? "Verify Your Email"
                : "Create Your Clinic Account"}
            </h2>
            <p className="text-slate-600 text-lg">
              {isVerificationStep
                ? `We've sent a 6-digit code to ${formData.email}. Please enter it below.`
                : "Register your clinic to get started"}
            </p>
          </div>

          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handlePaymentSubmit}
          />

          {/* Registration Form */}
          {isVerificationStep ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  required
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || verificationInput.length !== 6}
                className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 ${
                  isLoading || verificationInput.length !== 6
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-cyan-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify & Register"}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleProceedToVerification}>
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
                    required
                    placeholder="09XXXXXXXXX"
                    maxLength={11}
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

              {/* Clinic Picture Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Clinic Profile Picture
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-300 flex-shrink-0 flex items-center justify-center">
                    {picturePreview ? (
                      <img
                        src={picturePreview}
                        alt="Clinic Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <UploadCloud className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      name="clinicPicture"
                      id="clinicPicture"
                      onChange={handlePictureChange}
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                    />
                    <label
                      htmlFor="clinicPicture"
                      className="cursor-pointer bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Choose File
                    </label>
                    {clinicPicture && (
                      <p className="text-xs text-slate-500 mt-2">
                        {clinicPicture.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
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

                  {/* Password Validation Popup */}
                  {showPasswordValidation && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
                      <div className="space-y-2">
                        <ValidationItem
                          isValid={passwordValidation.firstLetterUppercase}
                          text="First letter must be uppercase"
                        />
                        <ValidationItem
                          isValid={passwordValidation.length}
                          text="At least 6 characters"
                        />
                        <ValidationItem
                          isValid={passwordValidation.number}
                          text="Must contain a number"
                        />
                        <ValidationItem
                          isValid={passwordValidation.specialChar}
                          text="Must contain a special character (!@#$%^&*)"
                        />
                      </div>
                    </div>
                  )}
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
                    <div className="text-start">
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Free
                      </h4>
                      <div className="text-2xl font-bold text-slate-800 mb-2">
                        ₱0<span className="text-sm font-normal">/month</span>
                      </div>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Up to 10 patients
                        </li>
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Basic scheduling
                        </li>
                        <li className="flex items-center justify-start">
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
                    <div className="text-start">
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Basic
                      </h4>
                      <div className="text-2xl font-bold text-slate-800 mb-2">
                        ₱199<span className="text-sm font-normal">/month</span>
                      </div>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Up to 20 patients
                        </li>
                        <li className="flex items-center justifystartr">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Advanced scheduling
                        </li>
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Priority support
                        </li>
                        <li className="flex items-center justify-start">
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
                    <div className="text-left">
                      <h4 className="font-semibold text-slate-800 mb-2">Pro</h4>
                      <div className="text-2xl font-bold text-slate-800 mb-2">
                        ₱299<span className="text-sm font-normal">/month</span>
                      </div>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Unlimited patients
                        </li>
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Full features
                        </li>
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          24/7 support
                        </li>
                        <li className="flex items-center justify-start">
                          <Check className="w-4 h-4 text-emerald-500 mr-1" />
                          Advanced analytics
                        </li>
                        <li className="flex items-center justify-start">
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
                  isLoading ||
                  !formData.agreeToTerms ||
                  !allPasswordRequirementsMet ||
                  formData.password !== formData.confirmPassword ||
                  (formData.subscriptionPlan !== "free" && !isPaymentSetup)
                }
                className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 ${
                  isLoading ||
                  !formData.agreeToTerms ||
                  !allPasswordRequirementsMet ||
                  formData.password !== formData.confirmPassword ||
                  (formData.subscriptionPlan !== "free" && !isPaymentSetup)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-cyan-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isLoading ? "Sending Code..." : "Send Verification Code"}
              </button>

              {formData.subscriptionPlan !== "free" && !isPaymentSetup && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Please set up payment details before creating your account
                </p>
              )}
            </form>
          )}

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
