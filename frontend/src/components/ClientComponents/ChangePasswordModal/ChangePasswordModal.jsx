// components/ChangePasswordModal.jsx
import { useState } from "react";
import { X, Check, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ChangePasswordModal = ({ isOpen, onClose, user }) => {
  const [step, setStep] = useState(1); // 1: Enter current pass, 2: Enter new pass, 3: Verify email
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  if (!isOpen) return null;

  // Password validation (same as your registration)
  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 6,
      firstLetterUppercase: /^[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  };

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      validatePassword(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Step 1: Verify current password and send verification email
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send verification email
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/auth/send-password-change-verification`,
        {
          email: user.email,
          currentPassword: formData.currentPassword,
        }
      );

      toast.success("Verification code sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to verify current password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code and change password
  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (!allPasswordRequirementsMet) {
      toast.error("Password does not meet requirements!");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-change-password`,
        {
          email: user.email,
          verificationCode: formData.verificationCode,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      toast.success("Password changed successfully! 🎉");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      verificationCode: "",
    });
    onClose();
  };

  const ValidationItem = ({ isValid, text }) => (
    <div
      className={`flex items-center space-x-2 text-sm ${
        isValid ? "text-green-600" : "text-red-500"
      }`}
    >
      {isValid ? (
        <Check className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span>{text}</span>
    </div>
  );

  const PasswordInput = ({
    name,
    value,
    placeholder,
    show,
    onToggle,
    label,
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-12"
        />
        <button
          type="button"
          onClick={() => onToggle(name)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {step === 1
              ? "Verify Current Password"
              : step === 2
              ? "Change Password"
              : "Verify Email"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? "bg-cyan-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Current Password */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <p className="text-slate-600 text-sm mb-4">
              For security, we need to verify your current password first.
            </p>

            <PasswordInput
              name="currentPassword"
              value={formData.currentPassword}
              placeholder="Enter current password"
              show={showPassword.current}
              onToggle={() => togglePasswordVisibility("current")}
              label="Current Password"
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.currentPassword}
                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Verifying..." : "Continue"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: New Password & Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <p className="text-slate-600 text-sm mb-4">
              We sent a verification code to <strong>{user.email}</strong>.
              Enter it below along with your new password.
            </p>

            {/* Verification Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                maxLength="6"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-center text-xl tracking-widest"
              />
            </div>

            {/* New Password */}
            <div className="relative">
              <PasswordInput
                name="newPassword"
                value={formData.newPassword}
                placeholder="Enter new password"
                show={showPassword.new}
                onToggle={() => togglePasswordVisibility("new")}
                label="New Password"
              />

              {/* Password Validation */}
              {showPasswordValidation && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-lg z-10 space-y-2">
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
              )}
            </div>

            {/* Confirm Password */}
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Confirm new password"
              show={showPassword.confirm}
              onToggle={() => togglePasswordVisibility("confirm")}
              label="Confirm New Password"
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !allPasswordRequirementsMet ||
                  formData.newPassword !== formData.confirmPassword
                }
                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
