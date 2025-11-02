"use client";

import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Star,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import logo from "../../../assets/medoralogo1.png";
import clinic from "../../../assets/clinic.jpg";
import { toast } from "sonner";

const ClientLogin = () => {
  const { login } = useContext(AuthContext);
  const [warningShown, setWarningShown] = useState(false);
  const [error, setError] = useState();
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/clinic`);
        if (response.ok) {
          const data = await response.json();
          setClinics(data);
        } else {
          console.error("Failed to fetch clinics");
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const clinicId = searchParams.get("clinicId");

    if (clinicId && clinics.length > 0) {
      const clinicFromUrl = clinics.find((c) => c._id === clinicId);
      if (clinicFromUrl) {
        setSelectedClinic(clinicFromUrl);
      }
    }
  }, [location.search, clinics]);

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!selectedClinic) {
      setError("Please select a clinic to log in.");
      return;
    }

    const loginClient = `${import.meta.env.VITE_API_URL}/auth/patient/login`;

    try {
      const res = await axios.post(loginClient, {
        ...formData,
        role: "patient",
      });

      if (res.data.patient) {
        login(res.data.patient, res.data.patient.role, rememberMe);
        console.log("Login successful for patient:", res.data.patient.email);

        navigate(`/client/dashboard?clinicId=${selectedClinic._id}`);
      }

      setFormData({ email: "", password: "" });
      setTimeout(() => {
        toast.success("Logged in successfully");
      }, 3000);
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.warning(error.response.data.message, {
          id: "login-error",
        });
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnkeyDown = (e) => {
    if (!selectedClinic) {
      e.preventDefault(); // 🚫 stops typing
      if (!warningShown) {
        toast.warning("Please select a clinic first!");
        setWarningShown(true);
      }
    }
  };

  const handleOnBlur = () => {
    setWarningShown(false); // reset when user leaves the input
  };

  const DefaultBrandingSection = () => (
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
              Patient Portal
            </p>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Your Health, Simplified
          </h2>
          <p className="text-cyan-100 text-lg leading-relaxed max-w-md">
            Securely access appointments, medical records, and health reminders
            in one place.
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

      {/* Security Notice */}
      <div className="absolute bottom-8 left-12 right-12">
        <p className="text-cyan-200 text-sm text-center flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Enterprise-grade security & encryption
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 relative bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${clinic})` }}
      >
        <DefaultBrandingSection />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-6 space-y-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} className="w-12 h-12" alt="Medora Logo" />
              <div className="ml-3 text-left">
                <h1 className="text-2xl font-bold text-slate-800">Medora</h1>
                <p className="text-cyan-600 text-sm font-medium">
                  Patient Portal
                </p>
              </div>
            </div>
          </div>

          <div
            className={`mb-8 ${
              selectedClinic
                ? "border border-cyan-200 p-6 bg-cyan-50 rounded-2xl"
                : ""
            }`}
          >
            <h2
              className={`text-3xl font-bold mb-2 ${
                selectedClinic ? "text-cyan-900" : "text-slate-800"
              }`}
            >
              {selectedClinic
                ? `Booking with ${selectedClinic.clinicName}`
                : "Welcome Back"}
            </h2>
            <p className={selectedClinic ? "text-cyan-700" : "text-slate-600"}>
              {selectedClinic
                ? "Sign in to complete your booking"
                : "Sign in to your patient dashboard"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Select Clinic
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl text-left flex justify-between items-center focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                >
                  <span
                    className={
                      selectedClinic ? "text-slate-800" : "text-slate-400"
                    }
                  >
                    {selectedClinic
                      ? selectedClinic.clinicName
                      : "Choose a clinic"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-2xl shadow-lg">
                    {clinics.map((clinic) => (
                      <div
                        key={clinic._id}
                        onClick={() => {
                          setSelectedClinic(clinic);
                          setIsDropdownOpen(false);
                          navigate(`/client/login?clinicId=${clinic._id}`);
                        }}
                        className="px-4 py-3 hover:bg-cyan-50 cursor-pointer"
                      >
                        {clinic.clinicName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={formData.email}
                  autoCorrect="on"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="email"
                  className={`w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 ${
                    !selectedClinic && "cursor-not-allowed bg-slate-100"
                  }`}
                  onKeyDown={handleOnkeyDown}
                  onBlur={handleOnBlur}
                  placeholder="patient@example.com"
                />
              </div>
            </div>

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
                  className={`w-full px-4 py-4 pr-12 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 ${
                    !selectedClinic && "cursor-not-allowed bg-slate-100"
                  }`}
                  onKeyDown={handleOnkeyDown}
                  onBlur={handleOnBlur}
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

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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

            {error && (
              <div className="border border-red-300 p-4 bg-red-50 flex items-center space-x-3 rounded-2xl">
                <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedClinic || isLoading}
              className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 ${
                !selectedClinic
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-cyan-700 hover:to-cyan-600"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  Signing in...
                  <Loader2 className="animate-spin" />
                </span>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-300" />
            <span className="px-4 text-xs text-slate-500 font-medium">
              PATIENT PORTAL
            </span>
            <div className="flex-1 border-t border-slate-300" />
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              New patient?{" "}
              <a
                href="/client/register"
                className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors hover:underline"
              >
                Create account
              </a>
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant & Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Trusted by healthcare providers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
