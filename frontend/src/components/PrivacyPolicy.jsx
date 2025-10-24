import { useState } from "react";
import { X, Shield, Lock, Eye, UserCheck } from "lucide-react";

const PrivacyPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto auto-hide-scroll">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Privacy Policy
                </h2>
                <p className="text-slate-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Welcome to Medora! 🏥
            </h3>
            <p className="text-slate-600 leading-relaxed">
              We take your privacy as seriously as a doctor takes sterilization.
              This policy explains how we handle your health information while
              keeping things secure and private.
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <UserCheck className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                What We Collect
              </h3>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-slate-800">Basic Info</h4>
                  <p className="text-slate-600 text-sm">
                    Your name, email, phone number - the usual suspects
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-slate-800">Health Data</h4>
                  <p className="text-slate-600 text-sm">
                    Appointments, medical history (we keep this extra safe!)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-slate-800">Usage Data</h4>
                  <p className="text-slate-600 text-sm">
                    How you use our app (so we can make it better)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                How We Use Your Data
              </h3>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>
                • To schedule your appointments (and remind you about them!)
              </li>
              <li>• To provide healthcare services (our main job!)</li>
              <li>• To improve our app (making it less annoying)</li>
              <li>• To send important updates (not spam, we promise!)</li>
              <li>• To comply with laws (the boring but important part)</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                How We Protect Your Data
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">
                  Encryption
                </h4>
                <p className="text-emerald-700 text-sm">
                  Your data is encrypted like a secret agent's messages
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">
                  Access Controls
                </h4>
                <p className="text-emerald-700 text-sm">
                  Only authorized medical staff can access your info
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">
                  HIPAA Compliant
                </h4>
                <p className="text-emerald-700 text-sm">
                  We follow strict healthcare privacy regulations
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">
                  Regular Audits
                </h4>
                <p className="text-emerald-700 text-sm">
                  We constantly check our security (like a health checkup!)
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Your Rights 🛡️
            </h3>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <p className="text-cyan-800 text-sm">
                You can access, correct, or delete your personal information.
                Just contact us - we won't make it complicated like insurance
                paperwork!
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-2">Questions?</h3>
            <p className="text-slate-600 text-sm">
              Contact our Privacy Team at{" "}
              <span className="text-cyan-600">privacy@medora.com</span>
              or call <span className="text-cyan-600">1-800-MEDORA</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
