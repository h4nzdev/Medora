import React, { useState } from "react";
import { Moon, Sun, FileText, Bell, User, Shield, Smartphone } from "lucide-react";

const ClientSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-6">
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600 mt-2 font-medium tracking-wide">
            Customize your personal preferences and account settings.
          </p>
        </header>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  {darkMode ? (
                    <Moon className="w-6 h-6 text-slate-600" />
                  ) : (
                    <Sun className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Dark Mode</h2>
                  <p className="text-slate-500">Toggle dark mode appearance</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  darkMode ? "bg-cyan-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Notification Settings</h2>
                <p className="text-slate-500">Manage your reminder notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-800">Push Notifications</h3>
                  <p className="text-slate-600 text-sm">Receive reminder notifications</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notifications ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-800">Sound Alerts</h3>
                  <p className="text-slate-600 text-sm">Play sound when reminders are due</p>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    soundEnabled ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      soundEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Account Settings</h2>
                <p className="text-slate-500">Manage your personal information</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Edit Profile</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Update your personal information</p>
              </button>

              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Change Password</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Update your account password</p>
              </button>
            </div>
          </div>

          {/* App Settings */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">App Preferences</h2>
                <p className="text-slate-500">Customize your app experience</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Reminder Settings</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Configure default reminder options</p>
              </button>

              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Data & Storage</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Manage your data and storage preferences</p>
              </button>
            </div>
          </div>

          {/* Privacy and Terms Section */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Privacy & Security</h2>
                <p className="text-slate-500">Review our privacy policy and terms of service</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Privacy Policy
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  Our privacy policy outlines how we collect, use, and protect your
                  personal health information. We are committed to maintaining the
                  confidentiality and security of your data.
                </p>
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700 transition-colors">
                  Read full policy →
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Terms of Service
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  By using our health reminder service, you agree to these terms which 
                  explain your rights and responsibilities as a user of our platform.
                </p>
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700 transition-colors">
                  Read full terms →
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-600" />
                  Data Security
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  Learn about how we protect your personal health data and what 
                  security measures we have in place to keep your information safe.
                </p>
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700 transition-colors">
                  Learn more →
                </button>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white/70 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Help & Support</h2>
                <p className="text-slate-500">Get help and contact support</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">FAQ</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Find answers to common questions</p>
              </button>

              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Contact Support</span>
                  <span className="text-slate-400">→</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Get in touch with our support team</p>
              </button>

              <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">App Version</span>
                  <span className="text-slate-500 text-sm">v1.2.0</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">Current app version information</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;