import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClinicHeader from "../components/ClinicComponents/ClinicHeader/ClinicHeader";
import ClinicSidebar from "../components/ClinicComponents/ClinicSidebar";
import useResponsive from "../hooks/useResponsive";
import MobileClinicView from "../page/ClinicPages/MobileClinicView";
import { AuthContext } from "../context/AuthContext";
import {
  containerVariants,
  floatingVariants,
  itemVariants,
  logoVariants,
  ringVariants,
} from "../animations/splashscreen";
import { useNotification } from "../context/NotificationContext"; // 👈 ADD THIS IMPORT
import Chatbot from "../components/ClinicComponents/Chatbot/Chatbot";

const ClinicLayout = ({ children }) => {
  const isMobile = useResponsive();
  const { user } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);
  const { setShowSplashNotif } = useNotification(); // 👈 ADD THIS

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowSplashNotif(false); // 👈 ADD THIS LINE - CRITICAL!
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (showSplash) {
    return (
      <AnimatePresence>
        <motion.div
          className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 relative overflow-hidden"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Animated background elements */}
          <motion.div className="absolute inset-0">
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-cyan-200/20 rounded-full blur-xl"
              variants={floatingVariants}
              animate="animate"
            />
            <motion.div
              className="absolute bottom-32 right-32 w-40 h-40 bg-sky-300/15 rounded-full blur-2xl"
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 1 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200/20 rounded-full blur-lg"
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 2 }}
            />
          </motion.div>

          <div className="text-center relative z-10 px-8">
            {/* Animated logo/icon */}
            <motion.div className="mb-8" variants={itemVariants}>
              <motion.div
                className="w-24 h-24 mx-auto mb-6 relative"
                variants={logoVariants}
              >
                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0 border-4 border-cyan-300/60 rounded-full"
                  variants={ringVariants}
                  animate="animate"
                />
                {/* Inner rotating ring */}
                <motion.div
                  className="absolute inset-3 border-2 border-sky-400/70 rounded-full"
                  variants={ringVariants}
                  animate="animate"
                  style={{ animationDirection: "reverse" }}
                />

                {/* Center icon - Medical cross */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                    <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
                      <motion.div
                        className="relative"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {/* Medical cross icon */}
                        <div className="w-4 h-1 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-1 h-4 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Greeting text */}
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-light text-slate-700 mb-2 tracking-wide">
                {getGreeting()}
              </h1>
            </motion.div>

            {/* Welcome message */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 bg-clip-text text-transparent tracking-wide leading-tight">
                Welcome Back
              </h2>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-800 bg-clip-text text-transparent mt-2">
                {user?.contactPerson || "Your Clinic"}
              </h3>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className="mt-4">
              <p className="text-slate-600 text-lg font-light">
                Managing healthcare with excellence
              </p>
            </motion.div>

            {/* Enhanced loading indicator */}
            <motion.div
              className="mt-12 flex justify-center space-x-2"
              variants={itemVariants}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom decoration */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 0.6, width: 80 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return isMobile ? (
    <MobileClinicView />
  ) : (
    <motion.div
      className="flex min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ClinicSidebar />
      <div className="flex-1 md:ml-64 lg:ml-64">
        <ClinicHeader />
        <main className="p-6 w-full">{children}</main>
        <Chatbot />
      </div>
    </motion.div>
  );
};

export default ClinicLayout;
