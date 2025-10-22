import React, { useState } from "react";
import { Moon, Sun, FileText } from "lucide-react";

const ClinicSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      {/* Dark Mode Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Dark Mode</h2>
            <p className="text-slate-500">Toggle dark mode appearance</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {darkMode ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Privacy and Terms Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Privacy & Terms
            </h2>
            <p className="text-slate-500">
              Review our privacy policy and terms of service
            </p>
          </div>
          <FileText className="w-5 h-5 text-slate-400" />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-2">Privacy Policy</h3>
            <p className="text-slate-600 text-sm">
              Our privacy policy outlines how we collect, use, and protect your
              personal information. We are committed to maintaining the
              confidentiality and security of your data.
            </p>
            <button className="mt-2 text-cyan-600 text-sm font-medium hover:text-cyan-700">
              Read full policy →
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-2">
              Terms of Service
            </h3>
            <p className="text-slate-600 text-sm">
              By using our service, you agree to these terms which explain your
              rights and responsibilities as a user of our platform.
            </p>
            <button className="mt-2 text-cyan-600 text-sm font-medium hover:text-cyan-700">
              Read full terms →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicSettings;
