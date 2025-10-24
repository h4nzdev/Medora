import { useState } from "react";
import { X, FileText, AlertTriangle, CheckCircle, Zap } from "lucide-react";

const TermsOfService = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto auto-hide-scroll">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Terms of Service
                </h2>
                <p className="text-slate-600">
                  Please read this before using our app! 📝
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
          {/* Welcome */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Welcome to Medora! 👋
            </h3>
            <p className="text-blue-700 text-sm">
              By using our app, you agree to these terms. Don't worry - we've
              tried to make them less boring than typical legal documents!
            </p>
          </section>

          {/* Account Terms */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Your Responsibilities
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Be Truthful</h4>
                  <p className="text-green-700 text-sm">
                    Provide accurate health information (no pretending you're
                    Superman!)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Keep Credentials Safe
                  </h4>
                  <p className="text-green-700 text-sm">
                    Don't share your password (not even with your pet!)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Use Responsibly
                  </h4>
                  <p className="text-green-700 text-sm">
                    Don't use our app for anything illegal or questionable
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Prohibited Stuff */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Please Don't 🚫
              </h3>
            </div>
            <div className="space-y-2 text-slate-600 bg-red-50 border border-red-200 rounded-xl p-4">
              <p>
                • Try to hack our systems (we have better security than Fort
                Knox!)
              </p>
              <p>• Share false medical information (this isn't WebMD!)</p>
              <p>• Use our platform to spam or harass others</p>
              <p>• Pretend to be someone you're not (we'll know!)</p>
              <p>• Attempt to access other people's medical data</p>
            </div>
          </section>

          {/* Medical Disclaimer */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Important Medical Disclaimer ⚠️
              </h3>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>
                  Medora is not a substitute for professional medical advice!
                </strong>
                While we help manage appointments and reminders, we don't
                provide medical diagnosis or treatment. Always consult with
                qualified healthcare providers for medical concerns. In
                emergencies, call your local emergency number immediately!
              </p>
            </div>
          </section>

          {/* Service Terms */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Service Stuff 🔧
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">
                  Availability
                </h4>
                <p className="text-slate-600 text-sm">
                  We try to keep the app running 24/7, but sometimes we need
                  maintenance (like everyone!)
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Updates</h4>
                <p className="text-slate-600 text-sm">
                  We might update these terms occasionally (we'll let you know!)
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Payment</h4>
                <p className="text-slate-600 text-sm">
                  Some features might require payment (but we'll always be
                  transparent!)
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">
                  Termination
                </h4>
                <p className="text-slate-600 text-sm">
                  We can suspend accounts for serious violations (but we'd
                  rather not!)
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-100 rounded-xl p-4 text-center">
            <h3 className="font-semibold text-slate-800 mb-2">
              Questions About These Terms?
            </h3>
            <p className="text-slate-600 text-sm">
              Contact us at{" "}
              <span className="text-cyan-600">legal@medora.com</span> - we're
              actually nice people! 😊
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
