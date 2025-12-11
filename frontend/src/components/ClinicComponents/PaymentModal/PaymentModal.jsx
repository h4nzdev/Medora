"use client";

import { useState } from "react";
import {
  X,
  CreditCard,
  ArrowLeft,
  Check,
  Loader2,
  QrCode,
  Smartphone,
  Zap,
  Shield,
  Clock,
  Lock,
} from "lucide-react";
import qr from "../../../assets/medora-qr.png";

export default function PaymentModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    accountName: "",
    expiryDate: "",
    cvv: "",
  });
  const [activeTab, setActiveTab] = useState("bank");

  const banks = ["PayMaya", "Metrobank", "BDO", "GCash"];

  const bankData = {
    PayMaya: {
      image:
        "https://cdn.brandfetch.io/id_IE4goUp/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1757558623352",
      name: "PayMaya",
    },
    Metrobank: {
      image:
        "https://thedigitalbanker.com/wp-content/uploads/2022/11/metrobank.jpg",
      name: "Metrobank",
    },
    BDO: {
      image:
        "https://cdn.brandfetch.io/idcWXsRcl7/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1668518656151",
      name: "BDO",
    },
    GCash: {
      image:
        "https://cdn.brandfetch.io/idU5cKFAqi/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1756404357711",
      name: "GCash",
    },
  };

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

  const handleClose = () => {
    setStep(1);
    setSelectedBank(null);
    setBankDetails({
      accountNumber: "",
      accountName: "",
      expiryDate: "",
      cvv: "",
    });
    setActiveTab("bank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in-0">
      <div className="w-full h-full max-h-[90vh] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto h-full flex flex-col transform transition-all duration-300 scale-100 animate-in zoom-in-95">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Complete Payment
                  </h2>
                  <p className="text-sm text-slate-600">
                    {activeTab === "bank" ? "Bank transfer" : "QR Code"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1.5 rounded-xl bg-slate-100 p-1.5">
              <button
                onClick={() => setActiveTab("bank")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "bank"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Bank Payment</span>
              </button>
              <button
                onClick={() => setActiveTab("qr")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "qr"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "bank" ? (
              // BANK PAYMENT
              <div className="h-full flex flex-col">
                {step === 1 && (
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 mb-4">
                      Select Your Bank
                    </h3>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {banks.map((bank) => (
                        <button
                          key={bank}
                          onClick={() => handleBankSelect(bank)}
                          className="p-4 border border-slate-200 rounded-xl hover:border-cyan-300 hover:bg-cyan-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-3"
                        >
                          <div className="p-2 rounded-lg bg-white shadow-sm">
                            <img
                              src={bankData[bank].image}
                              alt={bank}
                              className="w-10 h-10 rounded-md"
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-slate-800 text-base">
                              {bank}
                            </div>
                            <div className="text-sm text-slate-500 mt-0.5">
                              {bank === "GCash" || bank === "PayMaya"
                                ? "E-wallet • Instant"
                                : "Bank transfer • Secure"}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Security Info */}
                    <div className="mt-6 pt-5 border-t border-slate-200">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            Bank-Level Security
                          </p>
                          <p className="text-xs text-slate-600">
                            256-bit SSL encryption & PCI-DSS compliant
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <img
                          src={bankData[selectedBank].image}
                          alt={selectedBank}
                          className="w-8 h-8 rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">
                          {selectedBank}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Enter your payment details
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="flex-1 flex flex-col"
                    >
                      <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Account Number
                            </label>
                            <input
                              type="text"
                              name="accountNumber"
                              value={bankDetails.accountNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="1234 5678 9012"
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
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="John Doe"
                              required
                            />
                          </div>
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
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="123"
                              maxLength="4"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-200">
                        <div className="grid grid-cols-4 gap-3 mb-5">
                          <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg">
                            <Zap className="w-4 h-4 text-emerald-600 mb-1.5" />
                            <span className="text-xs font-medium text-emerald-700">
                              Instant
                            </span>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-cyan-50 rounded-lg">
                            <Lock className="w-4 h-4 text-cyan-600 mb-1.5" />
                            <span className="text-xs font-medium text-cyan-700">
                              Secure
                            </span>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-600 mb-1.5" />
                            <span className="text-xs font-medium text-blue-700">
                              24/7
                            </span>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                            <Check className="w-4 h-4 text-slate-600 mb-1.5" />
                            <span className="text-xs font-medium text-slate-700">
                              Verified
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4" />
                                Pay Now
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              // QR CODE
              <div className="h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">
                    Scan QR Code
                  </h3>
                  <p className="text-slate-600 mt-1.5">
                    Use your banking app to scan and pay instantly
                  </p>
                </div>

                {/* QR Code Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-200 shadow-sm">
                    <div className="w-64 h-64">
                      <img
                        src={qr}
                        alt="Medora QR Code"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-3 gap-4 mt-8 w-full">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                        <span className="text-base font-bold text-emerald-700">
                          1
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        Open App
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Launch banking app
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mb-2">
                        <span className="text-base font-bold text-cyan-700">
                          2
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        Scan QR
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Point camera at code
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <span className="text-base font-bold text-blue-700">
                          3
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        Confirm
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Verify & complete
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-3 gap-3 mt-8 w-full">
                    <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-xl">
                      <Zap className="w-5 h-5 text-emerald-600 mb-1.5" />
                      <span className="text-sm font-medium text-emerald-700">
                        Fast
                      </span>
                      <span className="text-xs text-emerald-600 mt-0.5">
                        10 seconds
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-cyan-50 rounded-xl">
                      <Shield className="w-5 h-5 text-cyan-600 mb-1.5" />
                      <span className="text-sm font-medium text-cyan-700">
                        Secure
                      </span>
                      <span className="text-xs text-cyan-600 mt-0.5">
                        Bank-level
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600 mb-1.5" />
                      <span className="text-sm font-medium text-blue-700">
                        24/7
                      </span>
                      <span className="text-xs text-blue-600 mt-0.5">
                        Always on
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-6 mt-6 border-t border-slate-200">
                  <button
                    onClick={handleClose}
                    className="w-full py-3.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-5 border-t border-slate-200 bg-slate-50/50">
            <p className="text-center text-sm text-slate-500">
              {activeTab === "bank"
                ? "Secured by PCI-DSS compliant gateway"
                : "Instant confirmation • No additional fees • Works with all major banks"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
