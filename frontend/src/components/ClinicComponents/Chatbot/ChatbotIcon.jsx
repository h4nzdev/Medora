import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import aicon from "../../../assets/ai-icon.png";

const ChatbotIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 1000); // Show after 1 second

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  return (
    <motion.div
      className="fixed bottom-10 right-10 z-50 cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main chatbot button */}
      <div className="relative">
        <motion.img
          src={aicon}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          animate={{
            boxShadow:
              isHovered || showGreeting
                ? "0 10px 25px -5px rgba(6, 182, 212, 0.4)"
                : "0 4px 15px -3px rgba(6, 182, 212, 0.3)",
          }}
        ></motion.img>

        {/* Online indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Auto-greeting bubble (shows automatically) */}
      <AnimatePresence>
        {showGreeting && !isHovered && (
          <motion.div
            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-cyan-500 text-white px-3 py-2 rounded-lg shadow-md whitespace-nowrap"
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <p className="text-sm font-medium">Hello there! 👋</p>
            <p className="text-xs text-cyan-100">How can I help you today?</p>

            {/* Little speech bubble tip */}
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-500 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover tooltip (replaces auto-greeting when hovered) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-18 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-md whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <p className="text-sm font-medium">Clinic AI Assistant</p>
            <p className="text-xs text-cyan-200">Click to chat with me!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotIcon;
