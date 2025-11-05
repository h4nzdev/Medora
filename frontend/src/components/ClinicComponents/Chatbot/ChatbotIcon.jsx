import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const ChatbotIcon = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
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
        <motion.div
          className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center"
          animate={{
            boxShadow: isHovered
              ? "0 10px 25px -5px rgba(6, 182, 212, 0.4)"
              : "0 4px 15px -3px rgba(6, 182, 212, 0.3)",
          }}
        >
          {/* Clinic AI Icon - Different from patient chat */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Building/Clinic icon */}
            <path
              d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM11 18H8V11H11V18ZM16 18H13V11H16V18ZM17 8H7V4H17V8Z"
              fill="white"
            />
          </svg>
        </motion.div>

        {/* Pulsing animation effect */}
        <motion.div
          className="absolute inset-0 w-14 h-14 bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

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

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-md whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <p className="text-sm font-medium">Clinic AI Assistant</p>
            <p className="text-xs text-cyan-200">Operations & Scheduling</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotIcon;
