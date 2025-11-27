import { useState } from "react";
import {
  Shield,
  CheckCircle,
  CreditCard,
  Star,
  Zap,
  Crown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    subtitle: "Perfect for getting started with basic clinic management.",
    price: "₱0",
    period: "/month",
    features: [
      "Up to 10 patients",
      "Basic scheduling",
      "Email support",
      "Standard templates",
      "Basic reporting",
    ],
    buttonText: "Get Started Free",
    popular: false,
    icon: Star,
  },
  {
    name: "Pro",
    subtitle: "Perfect for growing teams with enhanced support & features.",
    price: "₱299",
    period: "/month",
    features: [
      "Unlimited patients",
      "Full features access",
      "24/7 premium support",
      "Advanced analytics dashboard",
      "Custom integrations",
      "API access",
      "Multi-clinic management",
    ],
    buttonText: "Get Started",
    popular: true,
    icon: Crown,
  },
  {
    name: "Basic",
    subtitle: "Great way to start and see what works right for each program.",
    price: "₱199",
    period: "/month",
    features: [
      "Up to 20 patients",
      "Advanced scheduling",
      "Priority support",
      "Basic analytics",
      "SMS reminders",
    ],
    buttonText: "Get Started",
    popular: false,
    icon: Zap,
  },
];

export default function Subscriptions() {
  const [expandedPlan, setExpandedPlan] = useState(null);

  return (
    <section
      id="pricing"
      className="py-12 md:py-20 bg-gradient-to-br from-cyan-50 to-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Plans & Pricing
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-lg">
            Your health quality and 10+ years of experience for less money than
            hiring a single mid-level designer.
          </p>
        </div>

        {/* Mobile Accordion */}
        <div className="space-y-4 max-w-2xl mx-auto md:hidden">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isPro = plan.name === "Pro";

            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl overflow-hidden border ${
                  isPro
                    ? "border-cyan-500 shadow-lg"
                    : "border-slate-200 shadow"
                }`}
              >
                {/* Clickable Header */}
                <button
                  onClick={() =>
                    setExpandedPlan(expandedPlan === index ? null : index)
                  }
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        isPro ? "bg-cyan-100" : "bg-slate-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          isPro ? "text-cyan-600" : "text-slate-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-slate-800">
                          {plan.name}
                        </h4>
                        {plan.popular && (
                          <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                            Popular
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span
                          className={`text-2xl font-bold ${
                            isPro ? "text-cyan-600" : "text-slate-800"
                          }`}
                        >
                          {plan.price}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedPlan === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expandable Content */}
                {expandedPlan === index && (
                  <div className="px-6 pb-6 border-t border-slate-100 pt-4 animate-in fade-in duration-300">
                    <p className="text-slate-500 text-sm mb-4">
                      {plan.subtitle}
                    </p>

                    <a
                      href="/clinic/register"
                      className={`block w-full py-3 px-6 rounded-full font-semibold text-center transition-all duration-200 mb-6 ${
                        isPro
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {plan.buttonText}
                    </a>

                    {/* Features List */}
                    <ul className="space-y-3 text-sm">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle
                            className={`w-5 h-5 ${
                              isPro ? "text-cyan-500" : "text-slate-400"
                            } mt-0.5 flex-shrink-0`}
                          />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isPro = plan.name === "Pro";

            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl overflow-hidden flex flex-col h-full ${
                  isPro
                    ? "border-2 border-cyan-500 shadow-2xl transform scale-105"
                    : "border border-slate-200 shadow-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-6 right-6 z-10">
                    <div className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8 flex flex-col flex-1">
                  {/* Icon and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isPro ? "bg-cyan-100" : "bg-slate-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          isPro ? "text-cyan-600" : "text-slate-600"
                        }`}
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-800">
                      {plan.name}
                    </h4>
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-slate-500 mb-6 min-h-[60px]">
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-5xl font-bold ${
                          isPro ? "text-cyan-600" : "text-slate-800"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-slate-500 text-lg">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="/clinic/register"
                    className={`block w-full py-4 px-6 rounded-full font-semibold text-center transition-all duration-200 mb-8 ${
                      isPro
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    {plan.buttonText}
                  </a>

                  {/* Features List */}
                  <ul className="space-y-3 text-sm flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle
                          className={`w-5 h-5 ${
                            isPro ? "text-cyan-500" : "text-slate-400"
                          } mt-0.5 flex-shrink-0`}
                        />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Features */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 max-w-2xl mx-auto">
            <p className="text-slate-600 mb-6">
              All plans include security and essential features
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-5 h-5 text-cyan-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCard className="w-5 h-5 text-cyan-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
