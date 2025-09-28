"use client";

import { useState } from "react";
import {
  X,
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";

const banks = ["PayMaya", "Metrobank", "BDO", "GCash"];

// Bank icon mapping
const bankIcons = {
  PayMaya: Smartphone,
  Metrobank: Building2,
  BDO: Building2,
  GCash: Wallet,
};

const bankColors = {
  PayMaya: "from-cyan-500 to-cyan-600",
  Metrobank: "from-slate-500 to-slate-600",
  BDO: "from-cyan-600 to-cyan-700",
  GCash: "from-slate-600 to-slate-700",
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        {/* Header with progress indicator */}
        <div className="relative p-6 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {step === 1
                    ? "Select Payment Method"
                    : `${selectedBank} Details`}
                </h2>
                <p className="text-sm text-slate-600">
                  {step === 1
                    ? "Choose your preferred bank"
                    : "Enter your payment information"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                step >= 1 ? "bg-cyan-500" : "bg-slate-200"
              }`}
            />
            <div
              className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                step >= 2 ? "bg-cyan-500" : "bg-slate-200"
              }`}
            />
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {banks.map((bank) => {
                  const IconComponent = bankIcons[bank];
                  const gradientClass = bankColors[bank];

                  return (
                    <button
                      key={bank}
                      onClick={() => handleBankSelect(bank)}
                      className="group relative p-4 border border-slate-200 rounded-xl hover:border-cyan-300 hover:shadow-md transition-all duration-200 text-left overflow-hidden"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${gradientClass} text-white shadow-sm`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800 group-hover:text-cyan-600 transition-colors">
                            {bank}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {bank === "GCash" || bank === "PayMaya"
                              ? "E-wallet"
                              : "Bank transfer"}
                          </p>
                        </div>
                        <div className="text-slate-500 group-hover:text-cyan-600 transition-colors">
                          <svg
                            className="w-5 h-5"
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Selected bank header */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${bankColors[selectedBank]} text-white`}
                >
                  {(() => {
                    const IconComponent = bankIcons[selectedBank];
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{selectedBank}</h3>
                  <p className="text-sm text-slate-600">
                    Payment method selected
                  </p>
                </div>
                <div className="ml-auto">
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Account Name
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={bankDetails.accountName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={bankDetails.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={bankDetails.cvv}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <>
                        Completing
                        <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      "Complete Payment"
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
