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
  Eye,
  EyeOff,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import PaymentModal from "../../../components/ClinicComponents/PaymentModal/PaymentModal";
import logo from "../../../assets/medoralogo.png";
import { useNavigate } from "react-router-dom";
import clinic from "../../../assets/clinic.jpg";
import { createNotification } from "../../../services/notificationService";

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
    subscriptionPlan: "free",
    agreeToTerms: false,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });

  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clinicPicture, setClinicPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationInput, setVerificationInput] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [activeInput, setActiveInput] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      setShowPasswordValidation(value.length > 0);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendAdminNotification = async (
    message,
    systemMessage,
    type = "system",
    relatedId = null
  ) => {
    try {
      await createNotification({
        recipientType: "all", // This will notify all admins (system-wide)
        message: message,
        systemMessage: systemMessage,
        type: type,
        relatedId: relatedId,
      });
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setClinicPicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
              setPicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
            return 100;
          }
          return prev + 10;
        });
      }, 50);
    }
  };

  const handlePlanSelect = (plan) => {
    setFormData((prev) => ({
      ...prev,
      subscriptionPlan: plan,
    }));

    if (plan === "free") {
      setIsPaymentSetup(true);
      toast.success("Free plan selected! No payment required.");

      // Send notification
      sendAdminNotification(
        `A clinic selected the Free plan: ${
          formData.clinicName || "New Clinic"
        }`,
        "New Free Plan Subscription",
        "system"
      );
    } else {
      setIsPaymentSetup(false);
      setIsModalOpen(true);
    }
  };

  const handlePaymentSubmit = async (bankDetails) => {
    console.log("Bank Details:", bankDetails);
    setIsModalOpen(false);
    setIsPaymentSetup(true);
    toast.success("Payment details saved successfully!");

    // Send notification for premium plan payment
    await sendAdminNotification(
      `${formData.clinicName || "New Clinic"} set up payment for ${
        formData.subscriptionPlan
      } plan`,
      "Payment Setup Complete",
      "payment"
    );
  };

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);

  const handleProceedToVerification = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Client-side validation
    const errors = [];
    if (!allPasswordRequirementsMet) {
      errors.push("Password does not meet the requirements.");
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match.");
    }
    if (!formData.agreeToTerms) {
      errors.push("You must agree to the terms.");
    }
    if (formData.subscriptionPlan !== "free" && !isPaymentSetup) {
      errors.push("Please set up payment details first.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
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
      toast.error(
        error.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationInput = (index, value) => {
    if (value.length <= 1 && /^[0-9]?$/.test(value)) {
      const newInput = [...verificationInput];
      newInput[index] = value;
      setVerificationInput(newInput);

      if (value && index < 5) {
        setActiveInput(index + 1);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !verificationInput[index] && index > 0) {
      setActiveInput(index - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const code = verificationInput.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);

    const finalFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      finalFormData.append(key, formData[key]);
    });
    finalFormData.append("verificationCode", code);
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

      await sendAdminNotification(
        `New clinic registered: ${formData.clinicName}`,
        "New Clinic Registration",
        "system",
        res.data.clinic?._id || res.data.clinic?.id // If your API returns the created clinic ID
      );

      // Show success animation
      setTimeout(() => {
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
        setVerificationInput(["", "", "", "", "", ""]);
        setIsVerificationStep(false);
        navigate("/clinic/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div
      className={`flex items-center gap-2 transition-all duration-300 ${
        isValid ? "text-green-600" : "text-slate-400"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isValid ? "bg-green-500" : "bg-slate-300"
        }`}
      />
      <span className="text-sm">{text}</span>
    </div>
  );

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₱0",
      features: ["Up to 10 appointments", "Basic scheduling", "Email support"],
      color: "border-slate-200",
      activeColor: "border-blue-500 bg-blue-50",
    },
    {
      id: "basic",
      name: "Basic",
      price: "₱199",
      features: [
        "Up to 20 appointments",
        "Advanced scheduling",
        "Priority support",
        "Basic analytics",
      ],
      color: "border-slate-200",
      activeColor: "border-purple-500 bg-purple-50",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₱299",
      features: [
        "Unlimited appointments",
        "Full features",
        "24/7 support",
        "Advanced analytics",
        "Custom integrations",
      ],
      color: "border-slate-200",
      activeColor: "border-emerald-500 bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Side - Branding (Enhanced) */}
      <div
        className="hidden lg:flex lg:w-1/2 fixed top-0 left-0 h-screen bg-cover"
        style={{ backgroundImage: `url(${clinic})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col justify-center items-center w-full px-12 relative z-10">
          {/* Logo and Brand */}
          <div className="text-center mb-16">
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6">
                <img
                  src={logo}
                  className="w-24 h-24 rounded-3xl shadow-2xl shadow-black/30 animate-float"
                  alt="Medora Logo"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl animate-pulse" />
              </div>
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Medora
                </h1>
                <p className="text-blue-200 text-lg font-medium tracking-widest">
                  HEALTHCARE PLATFORM
                </p>
              </div>
            </div>

            <div className="space-y-6 text-center max-w-lg">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Transform Your
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Healthcare Practice
                </span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Join thousands of clinics worldwide who trust Medora for
                seamless patient management, scheduling, and practice growth.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-xl">
            {[
              { value: "1,000+", label: "Clinics", icon: Building },
              { value: "99.9%", label: "Uptime", icon: Shield },
              { value: "24/7", label: "Support", icon: Star },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-white font-bold text-2xl">
                    {stat.value}
                  </h3>
                  <p className="text-blue-200 text-sm font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Testimonial */}
          <div className="mt-16 max-w-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-blue-100 italic mb-4">
                "Medora transformed our clinic operations. Patient management
                has never been easier!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                <div className="ml-3">
                  <p className="text-white font-medium">Dr. Sarah Johnson</p>
                  <p className="text-blue-200 text-sm">Medical Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-start justify-center px-4 sm:px-6 lg:px-12 py-8 lg:py-12 overflow-y-auto h-screen">
        <div className="w-full max-w-2xl animate-slide-in">
          {/* Header with Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  isVerificationStep
                    ? setIsVerificationStep(false)
                    : navigate(-1)
                }
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </button>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isVerificationStep ? "bg-slate-300" : "bg-cyan-500"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    isVerificationStep ? "bg-cyan-500" : "bg-slate-300"
                  }`}
                />
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={logo}
                  className="w-12 h-12 rounded-2xl"
                  alt="Medora"
                />
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Medora</h1>
                  <p className="text-cyan-600 text-sm font-medium">
                    Healthcare Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                {isVerificationStep
                  ? "Verify Your Email"
                  : "Create Clinic Account"}
              </h2>
              <p className="text-slate-600">
                {isVerificationStep
                  ? `Enter the 6-digit code sent to ${formData.email}`
                  : "Start your 14-day free trial. No credit card required."}
              </p>
            </div>
          </div>

          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handlePaymentSubmit}
          />

          {/* Registration Form */}
          {isVerificationStep ? (
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <label className="block text-sm font-semibold text-slate-700">
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleProceedToVerification}
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Resend Code
                  </button>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center gap-3 mb-8">
                  {verificationInput.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) =>
                        handleVerificationInput(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => setActiveInput(index)}
                      className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 ${
                        activeInput === index
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-slate-300 hover:border-slate-400"
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/30`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-slate-500 mb-8">
                  Code expires in 10 minutes
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || verificationInput.some((d) => !d)}
                className={`w-full bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 ${
                  isLoading || verificationInput.some((d) => !d)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-cyan-700 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify & Complete Registration"
                )}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleProceedToVerification}>
              {/* Form Steps */}
              <div className="grid gap-6">
                {/* Clinic Info */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-slate-800">
                      Clinic Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Clinic Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="clinicName"
                          maxLength={100}
                          value={formData.clinicName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="Downtown Medical Center"
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contact Person *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="contactPerson"
                          maxLength={100}
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="Dr. John Smith"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-slate-800">
                      Contact Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="admin@clinic.com"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          maxLength={11}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="09XXXXXXXXX"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Clinic Address *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="123 Medical Drive, City, State 12345"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <UploadCloud className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-slate-800">
                      Clinic Profile Picture
                    </h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white shadow-lg overflow-hidden">
                        {picturePreview ? (
                          <img
                            src={picturePreview}
                            alt="Clinic Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building className="w-10 h-10 text-slate-400" />
                          </div>
                        )}
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="text-white text-xs font-semibold">
                            {uploadProgress}%
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
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
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-3 rounded-xl transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Upload Picture
                      </label>
                      <p className="text-xs text-slate-500 mt-2">
                        Recommended: 300x300px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-slate-800">Security</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          maxLength={16}
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="Create password"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Password Validation */}
                      {showPasswordValidation && (
                        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="grid grid-cols-2 gap-2">
                            <ValidationItem
                              isValid={passwordValidation.firstLetterUppercase}
                              text="First letter uppercase"
                            />
                            <ValidationItem
                              isValid={passwordValidation.length}
                              text="6+ characters"
                            />
                            <ValidationItem
                              isValid={passwordValidation.number}
                              text="Contains number"
                            />
                            <ValidationItem
                              isValid={passwordValidation.specialChar}
                              text="Special character"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          maxLength={16}
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                          placeholder="Confirm password"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-red-500 text-xs mt-2">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-cyan-600" />
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Choose Your Plan
                      </h3>
                      <p className="text-sm text-slate-500">
                        Start with 14-day free trial
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative border-2 rounded-xl p-5 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                          formData.subscriptionPlan === plan.id
                            ? plan.activeColor
                            : `${plan.color} hover:border-slate-300`
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <div className="text-center mb-4">
                          <h4 className="font-bold text-slate-800 mb-1">
                            {plan.name}
                          </h4>
                          <div className="text-2xl font-bold text-slate-800">
                            {plan.price}
                            <span className="text-sm font-normal text-slate-500">
                              /month
                            </span>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {formData.subscriptionPlan === plan.id && (
                          <div className="flex items-center justify-center gap-2 text-cyan-600 font-medium">
                            <BadgeCheck className="w-5 h-5" />
                            Selected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      id="agreeToTerms"
                    />
                    <div>
                      <label
                        htmlFor="agreeToTerms"
                        className="text-sm text-slate-600"
                      >
                        I agree to Medora's{" "}
                        <a
                          href="#"
                          className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          Privacy Policy
                        </a>
                        . I understand that my data will be processed in
                        accordance with these terms.
                      </label>
                    </div>
                  </div>
                </div>
              </div>

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
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isLoading ||
                  !formData.agreeToTerms ||
                  !allPasswordRequirementsMet ||
                  formData.password !== formData.confirmPassword ||
                  (formData.subscriptionPlan !== "free" && !isPaymentSetup)
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-blue-500 text-white hover:from-cyan-700 hover:to-blue-600 hover:shadow-xl hover:shadow-cyan-500/25 active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Continue to Verification"
                )}
              </button>

              {formData.subscriptionPlan !== "free" && !isPaymentSetup && (
                <div className="text-center">
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl py-3 px-4">
                    ⚠️ Please set up payment details before continuing
                  </p>
                </div>
              )}
            </form>
          )}

          {/* Sign In Link */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="/clinic/login"
                className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline"
              >
                Sign in to your clinic
              </a>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Trusted by 1,000+ Clinics</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-blue-500" />
              <span>Secure Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
