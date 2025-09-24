import { useState, useEffect, useContext } from "react";
import { Shield, Star, Check, ArrowLeft } from "lucide-react";
import axios from "axios";
import { ClinicContext } from "../../../context/ClinicContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/medoralogo.png";
import clinic from "../../../assets/clinic.jpg";

export default function ClientRegister() {
  const { clinics } = useContext(ClinicContext);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicId: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    emergencyContact: { name: "", email: "", mobile: "" },
  });

  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleProceedToVerification = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/patient/send-verification`,
        { email: formData.email }
      );
      // Show the code in the toast for easy testing
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
    setIsLoading(true);

    const finalFormData = {
      ...formData,
      verificationCode: verificationInput,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/patient/register`,
        finalFormData
      );
      toast.success(res.data.message);
      setFormData({
        clinicId: "",
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        emergencyContact: { name: "", email: "", mobile: "" },
      });
      setVerificationInput("");
      setIsVerificationStep(false);
      navigate("/client/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 relative bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${clinic})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="flex flex-col justify-center items-center w-full px-12 relative z-10 bg-black/60">
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
                  Patient Portal
                </p>
              </div>
            </div>
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Create Your Patient Account
              </h2>
              <p className="text-cyan-100 text-lg leading-relaxed max-w-md">
                Join Medora to manage appointments, records, and reminders
                securely.
              </p>
            </div>
          </div>
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
          <div className="absolute bottom-8 left-12 right-12">
            <p className="text-cyan-200 text-sm text-center flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Enterprise-grade security & encryption
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 lg:px-12 py-12 overflow-y-auto h-screen">
        <div className="w-full max-w-2xl">
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
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <img src={logo} className="w-16 h-16" alt="Medora Logo" />
              <div className="ml-4 text-left">
                <h1 className="text-2xl font-bold text-slate-800">Medora</h1>
                <p className="text-cyan-600 text-sm font-medium">
                  Patient Portal
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isVerificationStep
                ? "Verify Your Email"
                : "Create Your Patient Account"}
            </h2>
            <p className="text-slate-600 text-lg">
              {isVerificationStep
                ? `We\'ve sent a 6-digit code to ${formData.email}. Please enter it below.`
                : "Register to get started"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
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
                  disabled={isLoading || verificationInput.length !== 6} // Also disable if code not complete
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
              <form
                className="space-y-6"
                onSubmit={handleProceedToVerification}
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Clinic
                  </label>
                  <select
                    name="clinicId"
                    value={formData.clinicId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" disabled>
                      -- Choose a clinic --
                    </option>
                    {clinics?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.clinicName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="30"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="" disabled>
                        -- Select gender --
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
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
                      title="Phone number must start with +639 followed by 9 digits (total 12 characters including +639)"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="off"
                      placeholder="jane.doe@example.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="456 Elm Street, City, State 67890"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <hr className="text-slate-200" />
                <h2 className="font-semibold">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      placeholder="John Davis"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="emergencyContact.email"
                      value={formData.emergencyContact.email}
                      onChange={handleInputChange}
                      placeholder="john.davis@example.com"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact.mobile"
                      value={formData.emergencyContact.mobile}
                      onChange={handleInputChange}
                      required
                      placeholder="09XXXXXXXXX"
                      maxLength={11}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <hr className="text-slate-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    required
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
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.agreeToTerms ||
                    formData.password !== formData.confirmPassword
                  }
                  className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 ${
                    isLoading ||
                    !formData.agreeToTerms ||
                    formData.password !== formData.confirmPassword
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-cyan-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isLoading ? "Sending Code..." : "Send Verification Code"}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <a
                  href="/client/login"
                  className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors hover:underline"
                >
                  Sign in
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
    </div>
  );
}
