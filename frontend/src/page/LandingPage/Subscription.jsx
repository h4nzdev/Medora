import {
  Clock,
  Shield,
  CheckCircle,
  CreditCard,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSubscriptionTourGuide } from "../../hooks/useSubscriptionTourGuide";

const plans = [
  {
    name: "free",
    price: "₱0",
    priceDetails: "/month",
    features: ["Up to 10 patients", "Basic scheduling", "Email support"],
    icon: Star,
    popular: false,
  },
  {
    name: "basic",
    price: "₱199",
    priceDetails: "/month",
    features: [
      "Up to 20 patients",
      "Advanced scheduling",
      "Priority support",
      "Basic analytics",
      "SMS reminders",
    ],
    icon: Zap,
    popular: false,
  },
  {
    name: "pro",
    price: "₱299",
    priceDetails: "/month",
    features: [
      "Unlimited patients",
      "Full features access",
      "24/7 premium support",
      "Advanced analytics dashboard",
      "Custom integrations",
      "API access",
      "Multi-clinic management",
    ],
    icon: Crown,
    popular: true,
  },
];

const Subscriptions = () => {
  const [showTour, setShowTour] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("subscriptionPageVisited");
    if (!hasVisited) {
      setShowTour(true);
      localStorage.setItem("subscriptionPageVisited", "true");
    }
  }, []);

  useSubscriptionTourGuide(showTour);
  return (
    <section
      id="subscriptions"
      className="py-24 bg-gradient-to-br from-cyan-50 via-white to-cyan-50/30 relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/80 via-white to-cyan-50/60"></div>

      {/* Floating Medical Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 text-cyan-200/30 animate-float">
        <div className="w-full h-full bg-cyan-200/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-20 right-16 w-16 h-16 text-cyan-300/40 animate-float delay-1000">
        <div className="w-full h-full bg-cyan-300/30 rounded-full blur-xl"></div>
      </div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 text-cyan-400/20 animate-pulse">
        <div className="w-full h-full bg-cyan-400/20 rounded-full blur-lg"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#0891b2 1px, transparent 1px),
                            linear-gradient(90deg, #0891b2 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div id="tour-subscription-header" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <CreditCard className="w-4 h-4" />
            Transparent Pricing
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Choose Your Plan
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Flexible pricing plans designed for clinics of all sizes.
            <span className="text-cyan-600 font-semibold"> Start free</span> and
            upgrade as you grow.
          </p>
        </div>

        <div
          id="tour-subscription-cards"
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative group ${
                  plan.popular ? "md:-mt-4 md:mb-4" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div
                  className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 relative overflow-hidden ${
                    plan.popular
                      ? "border-cyan-500 scale-105 shadow-2xl"
                      : "border-slate-200/80 group-hover:border-cyan-300"
                  }`}
                >
                  {/* Gradient Top Bar */}
                  <div
                    className={`h-2 ${
                      plan.name === "free"
                        ? "bg-gradient-to-r from-slate-400 to-slate-500"
                        : plan.name === "basic"
                        ? "bg-gradient-to-r from-cyan-400 to-cyan-500"
                        : "bg-gradient-to-r from-cyan-500 to-cyan-600"
                    }`}
                  ></div>

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                          plan.name === "free"
                            ? "bg-slate-100 text-slate-600"
                            : plan.name === "basic"
                            ? "bg-cyan-100 text-cyan-600"
                            : "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white"
                        }`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>

                      <h4 className="text-2xl font-bold text-slate-800 mb-2 capitalize">
                        {plan.name} Plan
                      </h4>

                      <div className="flex items-baseline justify-center gap-1 mb-6">
                        <span className="text-4xl font-bold text-slate-800">
                          {plan.price}
                        </span>
                        <span className="text-slate-600">
                          {plan.priceDetails}
                        </span>
                      </div>

                      {/* CTA Button */}
                      <a
                        href="/clinic/register"
                        className={`w-full block py-4 px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                          plan.name === "free"
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-lg"
                            : plan.name === "basic"
                            ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:shadow-lg"
                            : "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <span className="relative z-10">
                          {plan.name === "free"
                            ? "Get Started Free"
                            : plan.name === "basic"
                            ? "Start Basic Plan"
                            : "Go Pro"}
                        </span>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </a>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-3 group/item"
                        >
                          <CheckCircle
                            className={`w-5 h-5 flex-shrink-0 ${
                              plan.name === "free"
                                ? "text-slate-400 group-hover/item:text-slate-600"
                                : plan.name === "basic"
                                ? "text-cyan-500 group-hover/item:text-cyan-600"
                                : "text-cyan-500 group-hover/item:text-cyan-600"
                            } transition-colors duration-200`}
                          />
                          <span className="text-slate-700 group-hover/item:text-slate-900 transition-colors duration-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Additional Info */}
        <div id="tour-subscription-features" className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/60 max-w-4xl mx-auto">
            <p className="text-slate-600 mb-8 text-lg">
              All plans include enterprise-grade security and compliance
              features
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-slate-600">
              <div className="flex items-center gap-3 bg-cyan-50 px-4 py-3 rounded-xl">
                <Shield className="w-5 h-5 text-cyan-500" />
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-3 bg-cyan-50 px-4 py-3 rounded-xl">
                <CreditCard className="w-5 h-5 text-cyan-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-3 bg-cyan-50 px-4 py-3 rounded-xl">
                <Clock className="w-5 h-5 text-cyan-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <p className="text-sm text-slate-500">
                Trusted by 500+ clinics nationwide • 99.9% uptime • 24/7 support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Subscriptions;
