"use client";

import {
  Crown,
  Zap,
  Users,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Clock,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const LandingPageSubscription = ({ onClose, onUpgrade }) => {
  const navigate = useNavigate();
  const plans = [
    {
      name: "free",
      displayName: "Free Plan",
      price: "₱0",
      priceDetails: "/month",
      features: [
        "Up to 20 patients",
        "Basic scheduling",
        "Email support",
        "Patient portal access",
        "Basic appointment reminders",
      ],
      icon: Zap,
      popular: false,
      badge: "Starter",
      cta: "Get Started Free",
    },
    {
      name: "basic",
      displayName: "Basic Plan",
      price: "₱199",
      priceDetails: "/month",
      features: [
        "Up to 20 patients",
        "Advanced scheduling",
        "Priority support",
        "Basic analytics",
        "Email & SMS reminders",
        "Medical records storage",
        "Prescription management",
      ],
      icon: Users,
      popular: false,
      badge: "Popular",
      cta: "Upgrade to Basic",
    },
    {
      name: "pro",
      displayName: "Pro Plan",
      price: "₱299",
      priceDetails: "/month",
      features: [
        "Unlimited patients",
        "Full features access",
        "24/7 priority support",
        "Advanced analytics & reports",
        "Custom integrations",
        "Multi-clinic management",
        "API access",
        "Export capabilities",
      ],
      icon: Crown,
      popular: true,
      badge: "Recommended",
      cta: "Go Pro",
    },
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Clinics" },
    { icon: Shield, value: "99.9%", label: "Uptime" },
    { icon: Clock, value: "24/7", label: "Support" },
    { icon: Star, value: "4.9/5", label: "Rating" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const handleRemindLater = () => {
    onClose(true);
  };

  const handleUpgrade = (planName) => {
    onUpgrade();
    navigate("/clinic/register");
    console.log(`User interested in: ${planName} plan`);
  };

  const getPlanIcon = (plan) => {
    switch (plan.name) {
      case "free":
        return <Zap className="w-5 h-5 text-cyan-600" />;
      case "basic":
        return <Users className="w-5 h-5 text-cyan-600" />;
      case "pro":
        return <Crown className="w-5 h-5 text-cyan-600" />;
      default:
        return <Zap className="w-5 h-5 text-cyan-600" />;
    }
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto hide-scroll"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Close Button */}
      <button
        onClick={() => onClose(false)}
        className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-slate-600" />
      </button>

      <div className="p-6">
        {/* Header */}
        <motion.div className="text-center mb-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 rounded-full text-cyan-700 text-sm font-medium mb-3">
              <Sparkles className="w-3 h-3" />
              Choose Your Plan
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl font-semibold text-slate-800 mb-2"
            variants={itemVariants}
          >
            Scale Your Clinic
          </motion.h2>

          <motion.p
            className="text-slate-600 max-w-xl mx-auto"
            variants={itemVariants}
          >
            Professional plans for clinics of all sizes
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-4 gap-3 mb-6"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-3 bg-slate-50 rounded-lg"
              variants={itemVariants}
            >
              <stat.icon className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-slate-800">
                {stat.value}
              </div>
              <div className="text-slate-500 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          variants={containerVariants}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-white rounded-xl border-2 ${
                plan.popular ? "border-cyan-500 shadow-md" : "border-slate-200"
              } hover:border-cyan-300 transition-all duration-200`}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.badge}
                  </div>
                </motion.div>
              )}

              <div className="p-5 h-full flex flex-col">
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-50 rounded-lg">
                    {getPlanIcon(plan)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {plan.displayName}
                    </h3>
                    {!plan.popular && (
                      <div className="text-cyan-600 text-xs font-medium">
                        {plan.badge}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-semibold text-slate-800">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {plan.priceDetails}
                  </span>
                </div>

                {/* Features List */}
                <div className="flex-grow mb-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm text-slate-600"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.05 + 0.3 }}
                      >
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? "bg-cyan-500 text-white hover:bg-cyan-600"
                      : plan.name === "free"
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Plan Comparison */}
        <motion.div
          className="bg-slate-50 rounded-lg p-4 mb-4"
          variants={itemVariants}
        >
          <div className="text-center text-sm text-slate-600">
            <span className="font-medium text-slate-700">
              All plans include:
            </span>{" "}
            14-day free trial • No credit card • Cancel anytime
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          variants={containerVariants}
        >
          <button
            onClick={handleRemindLater}
            className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={() => handleUpgrade("pro")}
            className="flex-1 py-2.5 px-4 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Start Pro Trial
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPageSubscription;
