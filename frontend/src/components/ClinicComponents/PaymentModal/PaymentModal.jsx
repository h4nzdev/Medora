"use client";

import { useState } from "react";
import { X, CreditCard, ArrowLeft, Check, Loader2 } from "lucide-react";

const banks = ["PayMaya", "Metrobank", "BDO", "GCash"];

// Bank data with actual image placeholders
const bankData = {
  PayMaya: {
    color: "bg-cyan-500",
    image:
      "https://cdn.brandfetch.io/id_IE4goUp/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1757558623352",
    name: "PayMaya",
  },
  Metrobank: {
    color: "bg-red-500",
    image:
      "https://thedigitalbanker.com/wp-content/uploads/2022/11/metrobank.jpg",
    name: "Metrobank",
  },
  BDO: {
    color: "bg-green-500",
    image:
      "https://cdn.brandfetch.io/idcWXsRcl7/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1668518656151",
    name: "BDO",
  },
  GCash: {
    color: "bg-blue-500",
    image:
      "https://cdn.brandfetch.io/idU5cKFAqi/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1756404357711",
    name: "GCash",
  },
};

export default function PaymentModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    accountName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bankDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 overflow-hidden">
        {/* Header with solid color background */}
        <div className="relative p-8 pb-6 bg-cyan-600 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {step === 1
                    ? "Select Payment Method"
                    : `${selectedBank} Details`}
                </h2>
                <p className="text-cyan-100 mt-1">
                  {step === 1
                    ? "Choose your preferred bank"
                    : "Enter your payment information"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step >= 1
                    ? "bg-white text-cyan-600"
                    : "bg-white/20 text-white"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Bank</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step >= 2
                    ? "bg-white text-cyan-600"
                    : "bg-white/20 text-white"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banks.map((bank) => {
                  const bankInfo = bankData[bank];

                  return (
                    <button
                      key={bank}
                      onClick={() => handleBankSelect(bank)}
                      className="group relative p-6 border-2 border-slate-200 rounded-2xl hover:border-cyan-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden bg-white hover:bg-cyan-50/30"
                    >
                      {/* Background solid color effect on hover */}
                      <div
                        className={`absolute inset-0 ${bankInfo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>

                      <div className="flex items-center gap-4 relative z-10">
                        {/* Actual image element */}
                        <div className="p-1 rounded-2xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <img
                            src={bankInfo.image}
                            alt={bank}
                            className="w-12 h-12 rounded-xl"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors text-lg">
                            {bank}
                          </h3>
                          <p className="text-slate-600 text-sm mt-1">
                            {bank === "GCash" || bank === "PayMaya"
                              ? "E-wallet • Instant"
                              : "Bank transfer • Secure"}
                          </p>
                        </div>

                        {/* Enhanced arrow */}
                        <div className="text-slate-400 group-hover:text-cyan-600 transition-colors group-hover:translate-x-1 transition-transform">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600 font-medium">
                  🔒 All payments are secure and encrypted
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              {/* Selected bank header with actual image */}
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-cyan-200">
                <div className="p-1 rounded-2xl bg-white shadow-lg">
                  <img
                    src={bankData[selectedBank].image}
                    alt={selectedBank}
                    className="w-12 h-12 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-lg">
                    {selectedBank}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Payment method selected
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      Account Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-200 text-lg font-medium"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      Account Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={bankDetails.accountName}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-200 text-lg font-medium"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        Expiry Date
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={bankDetails.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-200 text-lg font-medium"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        CVV
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={bankDetails.cvv}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-200 text-lg font-medium"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600 text-white rounded-2xl hover:bg-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Complete Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
