import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Star, Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import clinic from "../../../assets/clinic.jpg";
import logo from "../../../assets/medoralogo1.png";

export default function ClientRegister() {
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
    emergencyContact: { name: "", email: "", phone: "" },
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [patientPicture, setPatientPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [approvedClinics, setApprovedClinics] = useState([]); // New state for filtered clinics
  const navigate = useNavigate();
  const passwordValidationTimer = useRef(null);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/clinic`);
        setClinics(res.data);

        // Filter clinics to only show approved ones
        const filteredClinics = res.data.filter(
          (clinic) => clinic.status === "approved"
        );
        setApprovedClinics(filteredClinics);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
  }, []);

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
        clearTimeout(passwordValidationTimer.current);
        passwordValidationTimer.current = setTimeout(() => {
          setShowPasswordValidation(false);
        }, 3000);
      } else {
        setShowPasswordValidation(false);
      }
    }

    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPatientPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);

  const handleProceedToVerification = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!allPasswordRequirementsMet) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/patient/send-verification`,
        { email: formData.email }
      );
      setIsVerificationStep(true);
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error sending verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "emergencyContact") {
        finalFormData.append(key, JSON.stringify(formData[key]));
      } else {
        finalFormData.append(key, formData[key]);
      }
    });
    finalFormData.append("verificationCode", verificationInput);
    if (patientPicture) {
      finalFormData.append("patientPicture", patientPicture);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/patient/register`,
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
        emergencyContact: { name: "", email: "", phone: "" },
      });
      setPatientPicture(null);
      setImagePreview(null);
      setVerificationInput("");
      setIsVerificationStep(false);
      navigate("/client/login");
    } catch (error) {
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
    <div className="min-h-screen flex bg-slate-50">
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 relative bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${clinic})` }}
      >
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

          <div className="rounded-2xl">
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
                    {approvedClinics.length > 0 ? (
                      approvedClinics.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.clinicName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No approved clinics available
                      </option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      name="patientPicture"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      maxLength={100}
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
                      max={100}
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
                      required
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
                      required
                      placeholder="456 Elm Street, City, State 67890"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <hr className="border-slate-200" />
                <h3 className="font-semibold text-slate-800">
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.name"
                      maxLength={100}
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
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="09XXXXXXXXX"
                      maxLength={11}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      maxLength={16}
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setShowPasswordValidation(true)}
                      onBlur={() => setShowPasswordValidation(false)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      maxLength={16}
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
                  disabled={isLoading || !allPasswordRequirementsMet}
                  className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform focus:ring-2 focus:ring-cyan-500/20 focus:outline-none shadow-lg shadow-cyan-500/25 ${
                    isLoading || !allPasswordRequirementsMet
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
