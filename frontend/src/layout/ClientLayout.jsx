import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClientSidebar from "../components/ClientComponents/ClientSidebar";
import ClientMobileNav from "../components/ClientComponents/ClientMobileNav";
import ClientHeader from "../components/ClientComponents/ClientHeader/ClientHeader";
import { AuthContext } from "../context/AuthContext";
import { containerVariants, floatingVariants, itemVariants, logoVariants, ringVariants } from "../animations/splashscreen";
import TourModal from "../components/ClientComponents/TourModal/TourModal";

const ClientLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("hasCompletedClientTour");
    if (!hasCompletedTour) {
      setIsTourModalOpen(true);
    }
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Animation variants

  if (showSplash) {
    return (
      <AnimatePresence>
        <motion.div
          className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50/30 to-cyan-50 relative overflow-hidden"
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
              className="absolute bottom-32 right-32 w-40 h-40 bg-cyan-300/15 rounded-full blur-2xl"
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
                  className="absolute inset-3 border-2 border-blue-400/70 rounded-full"
                  variants={ringVariants}
                  animate="animate"
                  style={{ animationDirection: "reverse" }}
                />

                {/* Center icon */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                    <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
                      <motion.div
                        className="w-5 h-5 bg-white rounded-md"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
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
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 bg-clip-text text-transparent tracking-wide leading-tight">
                Welcome to
              </h2>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 via-blue-700 to-cyan-800 bg-clip-text text-transparent mt-2">
                {user?.clinicId?.clinicName}
              </h3>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className="mt-4">
              <p className="text-slate-600 text-lg font-light">
                We're glad to have you here
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

  return (
    <motion.div
      className="flex min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
    <TourModal 
        isOpen={isTourModalOpen} 
        onClose={() => {
          setIsTourModalOpen(false);
          localStorage.setItem("hasCompletedClientTour", "true");
        }}
      />
      {/* Sidebar for desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0">
        <ClientSidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ClientHeader />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 w-full pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Nav for mobile */}
      <div className="md:hidden">
        <ClientMobileNav />
      </div>
    </motion.div>
  );
};

export default ClientLayout;
