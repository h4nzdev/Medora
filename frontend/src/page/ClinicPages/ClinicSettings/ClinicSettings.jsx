import React, { useState, useContext, useEffect } from "react";
import {
  FileText,
  Bell,
  User,
  Shield,
  Smartphone,
  MessageCircle,
  Building,
  Users,
  CreditCard,
} from "lucide-react";
import { submitFeedback } from "../../../services/feedbackService";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "sonner";
import { useSettings } from "../../../context/SettingsContext";
import ChangePasswordModal from "../../../components/ClinicComponents/ChangePasswordModal/ChangePasswordModal";
import PrivacyPolicy from "../../../components/PrivacyPolicy";
import TermsOfService from "../../../components/TermsOfService";
import { useNavigate } from "react-router-dom";

const ClinicSettings = () => {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { settings, toggleNotifications, toggleSound } = useSettings();

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        userId: user._id,
        message: feedbackMessage,
        type: feedbackType,
      });
      toast.success("Thanks for your feedback! We'll check it out");
      setFeedbackMessage("");
    } catch (error) {
      toast.error("Oops! Failed to submit feedback. Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      const storedHistory = localStorage.getItem(`billingHistory_${user._id}`);
      if (storedHistory) {
        setBillingHistory(JSON.parse(storedHistory));
      }
    }
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-6">
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Clinic Settings
          </h1>
          <p className="text-slate-600 mt-2 font-medium tracking-wide">
            Manage your clinic preferences and administrative settings.
          </p>
        </header>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Notification Settings
                </h2>
                <p className="text-slate-500">
                  Manage clinic reminder notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-800">
                    Push Notifications
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Receive appointment notifications
                  </p>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.notifications ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-800">Sound Alerts</h3>
                  <p className="text-slate-600 text-sm">
                    Play sound for new appointments
                  </p>
                </div>
                <button
                  onClick={toggleSound}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.soundEnabled ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.soundEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          {/* Clinic Management */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Clinic Management
                </h2>
                <p className="text-slate-500">
                  Manage your clinic information and settings
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Edit Clinic Profile
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Update clinic name, address, and contact information
                </p>
              </button>

              <button
                onClick={() => navigate("/clinic/doctors")}
                className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Manage Staff
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Add or remove clinic staff members
                </p>
              </button>

              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Business Hours
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Set your clinic's operating hours
                </p>
              </button>
            </div>
          </div>
          {/* Account Settings */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Account Settings
                </h2>
                <p className="text-slate-500">
                  Manage your personal administrator account
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Edit Profile
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Update your personal information
                </p>
              </button>

              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Change Password
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Update your account password
                </p>
              </button>
            </div>
          </div>
          {/* 📝 FEEDBACK SECTION */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Send Feedback
                </h2>
                <p className="text-slate-500">
                  Found a bug? Have a suggestion? Let us know!
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Feedback Type
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="complaint">Complaint</option>
                  <option value="compliment">Compliment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows="4"
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  required
                  minLength="10"
                  maxLength="1000"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {feedbackMessage.length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !feedbackMessage.trim() ||
                  feedbackMessage.length < 10
                }
                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Feedback...
                  </>
                ) : (
                  "Send Feedback"
                )}
              </button>
            </form>

            <p className="text-slate-500 text-sm mt-4 text-center">
              We read every message and appreciate your help making our platform
              better!
            </p>
          </div>
          {/* Billing & Subscription */}
          {/* In your Settings page - Simplified Billing Section */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Subscription & Billing
                </h2>
                <p className="text-slate-500">
                  Manage your clinic's subscription plan and payments
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Simple Current Plan Display */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 capitalize">
                      {user?.subscriptionPlan || "Free"} Plan
                    </p>
                    <p className="text-slate-600 text-sm">
                      Active • Manage your subscription
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/clinic/subscriptions")} // Or your subscription route
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-800">
                    {
                      billingHistory.filter((item) => item.status === "Paid")
                        .length
                    }
                  </div>
                  <div className="text-slate-600 text-xs">Payments</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-800">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-slate-600 text-xs">Since</div>
                </div>
              </div>
            </div>
          </div>
          {/* Privacy and Terms Section */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Privacy & Security
                </h2>
                <p className="text-slate-500">
                  Review our privacy policy and terms of service
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => setShowPrivacyPolicy(true)}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Privacy Policy
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  Our privacy policy outlines how we collect, use, and protect
                  your clinic and patient information.
                </p>
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700 transition-colors">
                  Read full policy →
                </button>
              </div>

              <div
                onClick={() => setShowTerms(true)}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Terms of Service
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  By using our healthcare platform, you agree to these terms
                  which explain your rights and responsibilities.
                </p>
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700 transition-colors">
                  Read full terms →
                </button>
              </div>
            </div>
          </div>
          {/* Support Section */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Help & Support
                </h2>
                <p className="text-slate-500">Get help and contact support</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">FAQ</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Find answers to common questions
                </p>
              </button>

              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Contact Support
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Get in touch with our support team
                </p>
              </button>

              <div className="w-full text-left p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Platform Version
                  </span>
                  <span className="text-slate-500 text-sm">v1.2.0</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Current platform version information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrivacyPolicy
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        user={user}
      />
    </div>
  );
};

export default ClinicSettings;
