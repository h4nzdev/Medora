"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import PaymentModal from "../../../components/ClinicComponents/PaymentModal/PaymentModal";
import axios from "axios";
import { toast } from "react-toastify";

const plans = [
  {
    name: "free",
    price: "₱0",
    priceDetails: "/month",
    features: ["Up to 25 patients", "Basic scheduling", "Email support"],
  },
  {
    name: "basic",
    price: "₱199",
    priceDetails: "/month",
    features: [
      "Up to 100 patients",
      "Advanced scheduling",
      "Priority support",
      "Basic analytics",
    ],
  },
  {
    name: "pro",
    price: "₱299",
    priceDetails: "/month",
    features: [
      "Unlimited patients",
      "Full features",
      "24/7 support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
];

export default function ClinicSubscriptions() {
  const { user, setUser } = useContext(AuthContext);
  const currentPlan = user?.subscriptionPlan || "Free";
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = (plan) => {
    if (plan.toLowerCase() === currentPlan.toLowerCase()) {
      return; // Do nothing if the selected plan is the current plan
    }
    setSelectedPlan(plan);
    if (plan.toLowerCase() === "free") {
      updateSubscription(plan);
    } else {
      setIsModalOpen(true);
    }
  };

  const handlePaymentSubmit = (bankDetails) => {
    console.log("Bank Details:", bankDetails); // Mock submission
    setIsModalOpen(false);
    setIsPaymentSetup(true);
    updateSubscription(selectedPlan);
  };

  const updateSubscription = async (plan) => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/clinic/${user._id}/subscription`,
        {
          subscriptionPlan: plan,
        }
      );
      toast.success(res.data.message);
      setUser({ ...user, subscriptionPlan: plan });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        isLoading={isLoading}
      />
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-3">
          <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
              Subscription
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your subscription plan and billing
            </p>
          </div>
        </div>

        {/* Current Subscription Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Your Current Plan
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-cyan-700 capitalize">
                {currentPlan} Plan
              </p>
              <p className="text-slate-600">
                Billed monthly at{" "}
                {
                  plans.find(
                    (p) => p.name.toLowerCase() === currentPlan.toLowerCase()
                  )?.price
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan =
              plan.name.toLowerCase() === currentPlan.toLowerCase();
            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  isCurrentPlan
                    ? "border-2 border-cyan-600"
                    : "border border-slate-200"
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2 capitalize">
                  {plan.name} Plan
                </h3>
                <p className="text-4xl font-bold text-slate-800 mb-4">
                  {plan.price}
                  <span className="text-base font-normal">
                    {plan.priceDetails}
                  </span>
                </p>
                <ul className="text-slate-600 mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full rounded-xl font-medium py-2 ${
                    isCurrentPlan
                      ? "bg-cyan-600 text-white cursor-not-allowed"
                      : "border border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : "Update Plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Billing History
          </h2>
          <table className="w-full text-left rounded-md overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 px-4 font-semibold text-slate-700">Date</th>
                <th className="py-3 px-4 font-semibold text-slate-700">
                  Amount
                </th>
                <th className="py-3 px-4 font-semibold text-slate-700">
                  Status
                </th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">2024-05-01</td>
                <td className="py-3 px-4">$29.99</td>
                <td className="py-3 px-4 flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  Paid
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    className="text-cyan-600 hover:underline cursor-not-allowed"
                    disabled
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
              <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">2024-04-01</td>
                <td className="py-3 px-4">$29.99</td>
                <td className="py-3 px-4 flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  Paid
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    className="text-cyan-600 hover:underline cursor-not-allowed"
                    disabled
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
              <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">2024-03-01</td>
                <td className="py-3 px-4">$29.99</td>
                <td className="py-3 px-4 flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Failed
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    className="text-cyan-600 hover:underline cursor-not-allowed"
                    disabled
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
