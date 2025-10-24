import { useState } from "react";
import { X, Check, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  sendClinicPasswordChangeVerification,
  verifyAndChangeClinicPassword,
} from "../../../services/clinicPasswordService";

const ChangePasswordModal = ({ isOpen, onClose, user }) => {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Password validation
  const passwordValidation = {
    length: newPassword.length >= 6,
    firstLetterUppercase: /^[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    specialChar: /[!@#$%^&*]/.test(newPassword),
  };

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);
  const showPasswordValidation = newPassword.length > 0;

  // Step 1: Send verification email
  const handleStep1Submit = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    setIsLoading(true);
    try {
      await sendClinicPasswordChangeVerification(user.email, currentPassword);
      toast.success("Verification code sent to your email! 📧");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to verify current password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify and change password
  const handleStep2Submit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (!allPasswordRequirementsMet) {
      toast.error("Password does not meet all requirements!");
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      await verifyAndChangeClinicPassword(
        user.email,
        verificationCode,
        currentPassword,
        newPassword
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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {step === 1 ? "Verify Current Password" : "Change Password"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600"
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
          <div className="space-y-4">
            <p className="text-slate-600 text-sm mb-4">
              For security, we need to verify your current password first.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStep1Submit}
                disabled={isLoading || !currentPassword}
                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: New Password & Verification */}
        {step === 2 && (
          <div className="space-y-4">
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
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-center text-xl tracking-widest"
              />
            </div>

            {/* New Password */}
            <div className="relative">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setIsNewPasswordFocused(true)}
                    onBlur={() => setIsNewPasswordFocused(false)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Validation */}
              {showPasswordValidation && isNewPasswordFocused && (
                <div className="mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-lg space-y-2">
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
                    text="Must contain special character (!@#$%^&*)"
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleStep2Submit}
                disabled={
                  isLoading ||
                  !allPasswordRequirementsMet ||
                  newPassword !== confirmPassword ||
                  !verificationCode
                }
                className="flex-1 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
