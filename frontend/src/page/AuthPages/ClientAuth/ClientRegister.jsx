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
    emergencyContact: { name: "", email: "", phone: "" },
  });
  const [patientPicture, setPatientPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
        {/* ... existing JSX ... */}
      </div>
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 lg:px-12 py-12 overflow-y-auto h-screen">
        <div className="w-full max-w-2xl">
          {/* ... existing JSX ... */}
          <div className="rounded-2xl">
            {isVerificationStep ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* ... existing verification JSX ... */}
              </form>
            ) : (
              <form
                className="space-y-6"
                onSubmit={handleProceedToVerification}
              >
                {/* ... existing form fields ... */}
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
                {/* ... existing form fields ... */}
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
            {/* ... existing JSX ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
