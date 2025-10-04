import { useState } from "react";
import { X, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateInvoice } from "../../../../services/invoiceService";

export default function ClientPaymentModal({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [error, setError] = useState("");

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
        paidAmount: paid
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        <div className="relative p-6 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Complete Payment
                </h2>
                <p className="text-sm text-slate-600">
                  Invoice #{invoice.invoiceNumber}
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
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-slate-50/80 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                Total Amount Due
              </p>
              <p className="font-bold text-slate-700 text-3xl">
                ₱{invoice.totalAmount?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="paidAmount" className="block text-sm font-medium text-slate-700">
                Payment Amount
              </label>
              <input
                type="number"
                id="paidAmount"
                value={paidAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <p className="text-sm text-center text-slate-500">
              Enter the exact amount to complete the payment.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !paidAmount}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:bg-cyan-400 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}