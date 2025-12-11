import { useState } from "react";
import {
  X,
  CreditCard,
  Loader2,
  QrCode,
  Smartphone,
  CreditCardIcon,
} from "lucide-react";
import { toast } from "sonner";
import { updateInvoice } from "../../../../services/invoiceService";
import qr from "../../../../assets/medora-qr.png";

export default function ClientPaymentModal({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("qr"); // "qr" or "manual"

  const handleSubmit = async () => {
    // Validate input
    if (!paidAmount || isNaN(paidAmount) || parseFloat(paidAmount) <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    const paid = parseFloat(paidAmount);
    const total = invoice.totalAmount || 0;

    if (paid !== total) {
      setError(`Payment amount must be exactly ₱${total.toFixed(2)}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateInvoice(invoice._id, {
        status: "paid",
        paidAmount: paid,
      });
      toast.success("Payment successful!");
      onPaymentSuccess();
      onClose();
      setPaidAmount(""); // Reset form
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setPaidAmount(value);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleClose = () => {
    setPaidAmount("");
    setError("");
    setActiveTab("qr");
    onClose();
  };

  if (!isOpen) return null;

  const totalAmount = invoice.totalAmount?.toFixed(2) || "0.00";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in-0">
      {/* Outer container with max height */}
      <div className="w-full h-full max-h-[90vh] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto h-full flex flex-col transform transition-all duration-300 scale-100 animate-in zoom-in-95">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Complete Payment
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Invoice #{invoice.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - QR Code Payment */}
              <div className="space-y-6">
                {/* Payment Method Tabs */}
                <div className="flex space-x-1 rounded-xl bg-slate-100 p-1">
                  <button
                    onClick={() => setActiveTab("qr")}
                    className={`flex-1 py-2.5 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      activeTab === "qr"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`flex-1 py-2.5 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      activeTab === "manual"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    <span>Manual Payment</span>
                  </button>
                </div>

                {/* QR Code Section */}
                {activeTab === "qr" && (
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl border border-emerald-100">
                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Scan QR Code to Pay
                    </h3>

                    <div className="text-center space-y-4">
                      {/* Static QR Code Placeholder */}
                      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-dashed border-emerald-200">
                        <div className="max-w-xs mx-auto">
                          {/* QR Code Pattern - Simple static design */}
                          <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                            <img src={qr} alt="" />
                          </div>

                          {/* Invoice info overlay */}
                          <div className="mt-3">
                            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                              <span className="text-xs font-mono text-slate-600">
                                INV#{invoice.invoiceNumber}
                              </span>
                              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                              <span className="text-xs font-semibold text-emerald-700">
                                ₱{totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 text-sm">
                          How to Pay with QR Code:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-emerald-700">
                                1
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600">
                              Open your mobile banking or e-wallet app
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-emerald-700">
                                2
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600">
                              Tap "Scan QR Code" or similar option
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-emerald-700">
                                3
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600">
                              Point camera at the QR code above
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-emerald-700">
                                4
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600">
                              Confirm payment amount and complete
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Security Badges */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs text-emerald-700 font-medium">
                            Secure
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-50 rounded-lg border border-cyan-100">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          <span className="text-xs text-cyan-700 font-medium">
                            Instant
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                          <span className="text-xs text-slate-700 font-medium">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Payment Section */}
                {activeTab === "manual" && (
                  <div className="space-y-6">
                    <div className="p-4 sm:p-6 bg-slate-50/80 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-slate-800 text-lg mb-4">
                        Enter Payment Details
                      </h3>

                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
                          <p className="text-slate-500 text-xs sm:text-sm uppercase tracking-wide mb-1 font-semibold">
                            Total Amount Due
                          </p>
                          <p className="font-bold text-slate-800 text-2xl sm:text-3xl">
                            ₱{totalAmount}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="paidAmount"
                            className="block text-sm font-medium text-slate-700"
                          >
                            Payment Amount
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                              ₱
                            </div>
                            <input
                              type="number"
                              id="paidAmount"
                              value={paidAmount}
                              onChange={handleAmountChange}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                              disabled={loading}
                            />
                          </div>
                          {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                          )}
                        </div>

                        <p className="text-sm text-center text-slate-500 px-4">
                          Enter the exact amount of{" "}
                          <span className="font-semibold">₱{totalAmount}</span>{" "}
                          to complete payment.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !paidAmount}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md disabled:from-emerald-400 disabled:to-cyan-400 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCardIcon className="w-5 h-5" />
                          Complete Payment
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Payment Summary */}
              <div className="space-y-6">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-lg mb-4">
                    Payment Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-slate-600">Invoice Number</span>
                      <span className="font-semibold text-slate-800">
                        #{invoice.invoiceNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Clinic</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {invoice.clinicId?.clinicName || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Doctor</span>
                      <span className="font-semibold text-slate-800 text-right">
                        Dr. {invoice.doctorId?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-slate-600">Status</span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === "unpaid"
                            ? "bg-amber-100 text-amber-800"
                            : invoice.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-semibold">
                          Subtotal
                        </span>
                        <span className="font-semibold text-slate-800">
                          ₱
                          {invoice.services
                            ?.reduce(
                              (sum, service) => sum + parseFloat(service.price),
                              0
                            )
                            ?.toFixed(2) || "0.00"}
                        </span>
                      </div>

                      {invoice.tax > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-slate-600">Tax</span>
                          <span className="text-slate-600">
                            ₱{invoice.tax.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {invoice.discount > 0 && (
                        <div className="flex justify-between items-center mt-1 text-emerald-600">
                          <span>Discount</span>
                          <span className="font-medium">
                            -₱{invoice.discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-300">
                        <span className="text-lg font-bold text-slate-800">
                          Total
                        </span>
                        <span className="text-xl font-bold text-slate-800">
                          ₱{totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="p-4 sm:p-6 bg-white rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Accepted Payment Methods
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "GCash",
                      "PayMaya",
                      "Bank Transfer",
                      "Credit Card",
                      "Debit Card",
                    ].map((method) => (
                      <div
                        key={method}
                        className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium text-slate-700"
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Notes */}
                <div className="p-4 sm:p-6 bg-amber-50/50 rounded-xl border border-amber-100">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-700">
                        !
                      </span>
                    </span>
                    Important Information
                  </h4>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Payment confirmation may take 1-2 business days
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Keep your payment receipt for reference
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Contact support for any payment issues
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50/50">
            <p className="text-center text-xs text-slate-500">
              Secure payment processed through PCI-DSS compliant gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
