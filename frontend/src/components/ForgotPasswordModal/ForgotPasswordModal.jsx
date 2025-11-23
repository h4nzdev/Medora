// components/ForgotPasswordModal/ForgotPasswordModal.jsx
import React, { useState } from "react";
import { X, Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  requestPasswordReset,
  verifyAndResetPassword,
} from "../../services/forgotPasswordService";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storedEmail, setStoredEmail] = useState(""); // Store email after successful request

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await requestPasswordReset(email);
      toast.success("Verification code sent to your email!");
      setStoredEmail(email); // Store the email that was verified
      setStep(2);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("No account found with this email address.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to send verification code"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) return;

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await verifyAndResetPassword(storedEmail, code, newPassword);
      toast.success("Password reset successfully!");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setNewPassword("");
    setStoredEmail("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1
              ? "Forgot Password"
              : step === 2
              ? "Reset Password"
              : "Success!"}
          </h2>
          <button
            onClick={() => {
              onClose();
              setTimeout(resetForm, 300);
            }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="text-center mb-4">
                <Mail className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Reset Your Password
                </h3>
                <p className="text-slate-600 mt-2">
                  Enter your email address to receive a verification code.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!email || isLoading}
                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          )}

          {/* Step 2: Code and New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center mb-4">
                <Lock className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Create New Password
                </h3>
                <p className="text-slate-600 mt-2">
                  We sent a code to <strong>{storedEmail}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-center text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-slate-500 mt-1 text-center">
                  6-digit code from your email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter new password (min. 6 characters)"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={
                  !code || !newPassword || isLoading || newPassword.length < 6
                }
                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCode("");
                  setNewPassword("");
                }}
                className="w-full border border-slate-300 text-slate-700 py-3 px-4 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Back to Email
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-800">
                Password Reset Successfully!
              </h3>
              <p className="text-slate-600">
                Your password has been reset. You can now log in with your new
                password.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(resetForm, 300);
                }}
                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-cyan-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
