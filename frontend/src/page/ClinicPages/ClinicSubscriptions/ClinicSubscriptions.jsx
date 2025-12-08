"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  BarChart,
  Headphones,
  Zap,
} from "lucide-react";
import PaymentModal from "../../../components/ClinicComponents/PaymentModal/PaymentModal";
import { toast } from "sonner";
// Import our new subscription service
import {
  createSubscription,
  getClinicSubscription,
} from "../../../services/subscription_services/subscriptionService";

const plans = [
  {
    name: "free",
    price: "₱0",
    priceDetails: "/month",
    features: [
      { text: "Up to 20 patients", icon: Users },
      { text: "Basic scheduling", icon: Calendar },
      { text: "Email support", icon: Headphones },
    ],
    color: "slate",
    popular: false,
  },
  {
    name: "basic",
    price: "₱199",
    priceDetails: "/month",
    features: [
      { text: "Up to 20 patients", icon: Users },
      { text: "Advanced scheduling", icon: Calendar },
      { text: "Priority support", icon: Headphones },
      { text: "Basic analytics", icon: BarChart },
    ],
    color: "blue",
    popular: false,
  },
  {
    name: "pro",
    price: "₱299",
    priceDetails: "/month",
    features: [
      { text: "Unlimited patients", icon: Users },
      { text: "Full features access", icon: Zap },
      { text: "24/7 premium support", icon: Headphones },
      { text: "Advanced analytics", icon: BarChart },
      { text: "Custom integrations", icon: Zap },
    ],
    color: "cyan",
    popular: true,
  },
];

export default function ClinicSubscriptions() {
  const { user, setUser } = useContext(AuthContext);
  // We'll now get current plan from subscription instead of user
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const currentPlan = currentSubscription?.plan || "free";
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Fetch current subscription when component loads
  useEffect(() => {
    if (user && user._id) {
      fetchCurrentSubscription();

      // Keep your existing billing history logic
      const storedHistory = localStorage.getItem(`billingHistory_${user._id}`);
      if (storedHistory) {
        setBillingHistory(JSON.parse(storedHistory));
      }
    }
  }, [user]);

  // Calculate days remaining for current subscription
  useEffect(() => {
    if (currentSubscription?.endDate) {
      const endDate = new Date(currentSubscription.endDate);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    }
  }, [currentSubscription]);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await getClinicSubscription(user._id);
      if (response.success) {
        setCurrentSubscription(response.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // If no subscription found, it's okay - clinic might be on free plan
    }
  };

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

  const handlePaymentSubmit = async (bankDetails) => {
    console.log("Bank Details:", bankDetails); // Mock submission

    if (!isLoading) {
      setIsModalOpen(false);
    }

    setIsPaymentSetup(true);
    await updateSubscription(selectedPlan);
  };

  const updateSubscription = async (plan) => {
    setIsLoading(true);
    try {
      const planDetails = plans.find(
        (p) => p.name.toLowerCase() === plan.toLowerCase()
      );
      const amount = planDetails
        ? parseInt(planDetails.price.replace("₱", ""))
        : 0;

      // Use our new service to create subscription
      const response = await createSubscription({
        clinicId: user._id,
        plan: plan.toLowerCase(),
        amount: amount,
      });

      if (response.success) {
        toast.success("Subscription updated successfully!");

        // Update local state with new subscription
        setCurrentSubscription(response.data);

        // Update user context if needed (optional)
        setUser({ ...user, subscriptionPlan: plan });

        // Keep your existing billing history logic
        const newTransaction = {
          date: new Date().toISOString().split("T")[0],
          amount: planDetails ? planDetails.price : "₱0",
          status: "Paid",
        };

        const updatedHistory = [...billingHistory, newTransaction];
        setBillingHistory(updatedHistory);
        if (user && user._id) {
          localStorage.setItem(
            `billingHistory_${user._id}`,
            JSON.stringify(updatedHistory)
          );
        }
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription.");

      // Keep your existing error handling for billing history
      const planDetails = plans.find(
        (p) => p.name.toLowerCase() === (selectedPlan || plan).toLowerCase()
      );
      const newTransaction = {
        date: new Date().toISOString().split("T")[0],
        amount: planDetails ? planDetails.price : "₱0",
        status: "Failed",
      };
      const updatedHistory = [...billingHistory, newTransaction];
      setBillingHistory(updatedHistory);
      if (user && user._id) {
        localStorage.setItem(
          `billingHistory_${user._id}`,
          JSON.stringify(updatedHistory)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if a plan should be disabled
  const isPlanDisabled = (planName) => {
    // If user is on free plan, nothing is disabled
    if (currentPlan === "free") return false;

    // If user is on pro plan, they can only downgrade to free or stay on pro
    if (currentPlan === "pro") {
      return planName !== "free" && planName !== "pro";
    }

    // If user is on basic plan, they can only upgrade to pro or downgrade to free
    if (currentPlan === "basic") {
      return planName !== "free" && planName !== "pro";
    }

    return false;
  };

  const getPlanColor = (color) => {
    const colors = {
      slate: "bg-slate-100 text-slate-800 border-slate-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        isLoading={isLoading}
      />

      <div className="mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-2xl shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Subscription Plans
                </h1>
                <p className="text-slate-600 mt-2">
                  Choose the perfect plan for your clinic's needs
                </p>
              </div>
            </div>
          </div>

          {/* Current Subscription Card */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Your Current Plan
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="text-2xl font-bold capitalize">
                      {currentPlan}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Active</span>
                  </div>
                </div>
                <p className="mt-3 text-cyan-100">
                  {currentSubscription?.startDate ? (
                    <>
                      Started on{" "}
                      {new Date(
                        currentSubscription.startDate
                      ).toLocaleDateString()}
                      {currentSubscription?.endDate && daysRemaining > 0 && (
                        <span className="ml-4">
                          • Renews in {daysRemaining} day
                          {daysRemaining !== 1 ? "s" : ""}
                        </span>
                      )}
                    </>
                  ) : (
                    "No active subscription"
                  )}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {plans.find(
                      (p) => p.name.toLowerCase() === currentPlan.toLowerCase()
                    )?.price || "₱0"}
                    <span className="text-lg font-normal">/month</span>
                  </p>
                  <p className="text-cyan-100">Billed monthly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan =
              plan.name.toLowerCase() === currentPlan.toLowerCase();
            const disabledPlan = isPlanDisabled(plan.name);
            const FeatureIcon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                  isCurrentPlan
                    ? "ring-4 ring-cyan-500 ring-opacity-50"
                    : "hover:shadow-2xl"
                } ${disabledPlan ? "opacity-75" : ""}`}
              >
                {/* Popular badge */}
                {plan.popular && !disabledPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div
                  className={`bg-white rounded-2xl p-6 h-full ${
                    disabledPlan
                      ? "border-2 border-dashed border-slate-300"
                      : "border border-slate-200"
                  }`}
                >
                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800 capitalize">
                        {plan.name} Plan
                      </h3>
                      {isCurrentPlan && (
                        <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                          Current
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-slate-900">
                          {plan.price}
                        </span>
                        <span className="ml-2 text-slate-600">
                          {plan.priceDetails}
                        </span>
                      </div>
                    </div>

                    {/* Plan Status Indicator */}
                    {disabledPlan && (
                      <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg mb-4 text-sm">
                        <XCircle className="w-4 h-4 inline mr-2" />
                        Not available from your current plan
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-slate-700 mb-4">
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                          <li key={i} className="flex items-start">
                            <Icon
                              className={`w-5 h-5 mr-3 mt-0.5 text-${plan.color}-500 flex-shrink-0`}
                            />
                            <span className="text-slate-700">
                              {feature.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => handlePlanSelect(plan.name)}
                    disabled={isCurrentPlan || isLoading || disabledPlan}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      isCurrentPlan
                        ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                        : disabledPlan
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : plan.name === "pro"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                        : plan.name === "basic"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                        : "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800"
                    }`}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : disabledPlan
                      ? "Unavailable"
                      : isLoading
                      ? "Processing..."
                      : plan.name === "free"
                      ? "Downgrade to Free"
                      : `Upgrade to ${
                          plan.name.charAt(0).toUpperCase() + plan.name.slice(1)
                        }`}
                  </button>

                  {/* Downgrade warning for pro plan */}
                  {plan.name === "free" && currentPlan === "pro" && (
                    <p className="text-sm text-amber-600 mt-3 text-center">
                      Downgrading may limit your current features
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Billing History
            </h2>
            <p className="text-slate-600 mt-1">
              Track all your subscription payments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-slate-700">
                    Plan
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-slate-700">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.length > 0 ? (
                  billingHistory.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium">{item.date}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.amount === "₱299"
                              ? "bg-cyan-100 text-cyan-800"
                              : item.amount === "₱199"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {item.amount === "₱299"
                            ? "Pro"
                            : item.amount === "₱199"
                            ? "Basic"
                            : "Free"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-lg font-semibold text-slate-800">
                          {item.amount}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status === "Paid" ? (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          {item.status}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline disabled:text-slate-400 disabled:cursor-not-allowed"
                          disabled
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CreditCard className="w-16 h-16 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-lg font-medium mb-2">
                          No billing history yet
                        </p>
                        <p className="text-slate-400">
                          Your subscription transactions will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Need help choosing a plan?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-cyan-600 font-semibold mb-2">
                For small clinics
              </div>
              <p className="text-slate-600 text-sm">
                Basic plan is perfect for clinics with up to 20 patients
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-cyan-600 font-semibold mb-2">
                Growing practice
              </div>
              <p className="text-slate-600 text-sm">
                Pro plan supports unlimited patients and advanced features
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-cyan-600 font-semibold mb-2">
                Cancel anytime
              </div>
              <p className="text-slate-600 text-sm">
                Downgrade to free plan or cancel your subscription anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
