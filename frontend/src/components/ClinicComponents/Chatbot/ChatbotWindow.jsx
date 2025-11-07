import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  chatWithClinicAI,
  isClinicUser,
  formatClinicInsights,
} from "../../../services/clinic_services/clinicAIService";
import { X } from "lucide-react";

const ChatbotWindow = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Sample welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `Hello ${
            user?.contactPerson || "Clinic Staff"
          }! I'm your Medora Clinic AI assistant. How can I help with your clinic operations today?`,
          isBot: true,
          timestamp: new Date(),
          clinicData: null,
        },
      ]);
    }
  }, [isOpen, messages.length, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const data = await chatWithClinicAI(message);

      // Format clinic insights for display
      const formattedClinicData = formatClinicInsights(data.clinic_data);

      // Clean the response text - replace * with spaces
      const cleanedResponse = data.ai_response.reply.replace(/\*/g, " ");

      // Add bot response with clinic data
      const botMessage = {
        id: Date.now() + 1,
        text: cleanedResponse,
        isBot: true,
        timestamp: new Date(),
        clinicData: formattedClinicData,
        insights: data.ai_response.clinic_insights,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      let errorText =
        "Sorry, I'm having trouble connecting right now. Please try again later.";

      if (error.response?.status === 401) {
        errorText =
          "Please log in to your clinic account to use the AI assistant.";
      } else if (error.response?.status === 403) {
        errorText = "This feature is only available for clinic staff.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-20 right-6 w-98 h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
        >
          {/* Header - Bigger */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-t-xl text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Medora Clinic AI</h3>
              <p className="text-sm opacity-90">Operations Assistant</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-lg font-bold"
            >
              <X />
            </button>
          </div>

          {/* Chat Messages - Bigger */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${msg.isBot ? "" : "flex justify-end"}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl p-4 ${
                    msg.isBot
                      ? "bg-white border border-gray-200 text-gray-800"
                      : "bg-blue-500 text-white"
                  } ${
                    msg.isError
                      ? "bg-red-100 border border-red-300 text-red-800"
                      : ""
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap">{msg.text}</p>

                  {/* Show clinic data insights if available */}
                  {msg.clinicData && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-2">
                          <span>Today's Appointments:</span>
                          <span className="font-semibold">
                            {msg.clinicData.todaysAppointments}
                          </span>

                          <span>Pending:</span>
                          <span className="font-semibold text-orange-500">
                            {msg.clinicData.pendingAppointments}
                          </span>

                          <span>Scheduled:</span>
                          <span className="font-semibold text-green-500">
                            {msg.clinicData.scheduledAppointments}
                          </span>

                          <span>Doctors:</span>
                          <span className="font-semibold">
                            {msg.clinicData.totalDoctors}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p
                    className={`text-sm mt-2 ${
                      msg.isBot ? "text-gray-500" : "text-blue-200"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator - Bigger */}
            {isLoading && (
              <div className="mb-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-[90%]">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Bigger */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about appointments, schedule, or clinic operations..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="bg-cyan-500 text-white px-5 py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-base font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotWindow;
