"use client";

import { X, Crown, Zap, CheckCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SubscriptionPopup = ({
  isOpen,
  onClose,
  featureName,
  requiredPlan,
  currentPlan,
}) => {
  const plans = {
    pro: {
      name: "Pro Plan",
      price: "₱299",
      period: "/month",
      features: [
        "Unlimited patients",
        "Advanced Analytics & Charts",
        "24/7 priority support",
        "Custom integrations",
        "Export capabilities",
        "All Basic features included",
      ],
      icon: Crown,
      gradient: "from-cyan-500 to-blue-600",
      popular: true,
    },
    basic: {
      name: "Basic Plan",
      price: "₱199",
      period: "/month",
      features: [
        "Up to 20 patients",
        "Basic scheduling",
        "Priority support",
        "Limited analytics",
      ],
      icon: Zap,
      gradient: "from-cyan-400 to-blue-500",
      popular: false,
    },
  };

  const targetPlan = plans[requiredPlan.toLowerCase()];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-auto overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div
              className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <motion.div
                className="flex items-center space-x-3 mb-2"
                variants={itemVariants}
              >
                <Crown className="w-8 h-8" />
                <h2 className="text-2xl font-bold">
                  Upgrade to Unlock Premium Features
                </h2>
              </motion.div>

              <motion.p
                className="text-cyan-100 text-lg"
                variants={itemVariants}
              >
                You need{" "}
                <span className="font-semibold">{targetPlan.name}</span> to
                access <span className="font-semibold">{featureName}</span>
              </motion.p>
            </motion.div>

            {/* Content */}
            <motion.div
              className="p-6"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              {/* Current Plan Highlight */}
              <motion.div
                className="flex items-center justify-center mb-6"
                variants={itemVariants}
              >
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl px-4 py-3">
                  <p className="text-cyan-800 font-medium text-center">
                    Current Plan:{" "}
                    <span className="capitalize font-semibold">
                      {currentPlan}
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Plan Card */}
              <motion.div
                className={`relative bg-gradient-to-br ${targetPlan.gradient} rounded-2xl p-1 mb-6`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                variants={itemVariants}
              >
                {targetPlan.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>MOST POPULAR</span>
                    </div>
                  </motion.div>
                )}

                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={`p-2 rounded-lg bg-gradient-to-r ${targetPlan.gradient}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <targetPlan.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {targetPlan.name}
                        </h3>
                        <p className="text-gray-600">
                          Perfect for growing clinics
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {targetPlan.price}
                      </div>
                      <div className="text-gray-600">{targetPlan.period}</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <motion.ul
                    className="space-y-3 mb-6"
                    variants={staggerChildren}
                  >
                    {targetPlan.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center space-x-3"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring" }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        </motion.div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex space-x-3"
                    variants={itemVariants}
                  >
                    <motion.button
                      onClick={onClose}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Maybe Later
                    </motion.button>
                    <motion.button
                      onClick={() => onClose()}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/clinic/subscriptions">Upgrade Now</Link>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Additional Benefits */}
              <motion.div
                className="grid grid-cols-3 gap-4 text-center"
                variants={staggerChildren}
              >
                <motion.div
                  className="p-3 bg-cyan-50 rounded-xl"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="text-cyan-600 font-bold">24/7</div>
                  <div className="text-cyan-800 text-sm">Support</div>
                </motion.div>
                <motion.div
                  className="p-3 bg-green-50 rounded-xl"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="text-green-600 font-bold">30-Day</div>
                  <div className="text-green-800 text-sm">Money Back</div>
                </motion.div>
                <motion.div
                  className="p-3 bg-blue-50 rounded-xl"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="text-blue-600 font-bold">No Setup</div>
                  <div className="text-blue-800 text-sm">Fees</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionPopup;
