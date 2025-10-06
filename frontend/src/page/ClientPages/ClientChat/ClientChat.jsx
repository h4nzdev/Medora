import {
  Bot,
  Send,
  User,
  Shield,
  Clock,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "sonner";

const ClientChat = () => {
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatCredits, setChatCredits] = useState({
    credits: 0,
    maxCredits: 5,
    canChat: true,
  });
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const { user } = useContext(AuthContext);

  // Function to fetch chat credits
  const fetchChatCredits = async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/chat/credits/${user._id}`
        );
        setChatCredits(response.data);
      } catch (error) {
        console.error("Error fetching chat credits:", error);
      }
    }
  };

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    } else {
      setChatHistory([
        {
          role: "bot",
          text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Fetch chat credits when user is available
  useEffect(() => {
    if (user && user._id) {
      fetchChatCredits();
    }
  }, [user]);

  const handleClearHistory = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([
      {
        role: "bot",
        text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
      },
    ]);
    setShowEmergency(false);
    setEmergencyData(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Check if user can still chat
    if (!chatCredits.canChat) {
      const errorMessage = {
        role: "bot",
        text: "You've reached your daily chat limit of 5 messages. Please come back tomorrow for more assistance.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      // 1) Save the user's message immediately
      if (user && user._id) {
        if (!user.clinicId) {
          throw new Error(
            "Patient clinic information not found. Please log in again."
          );
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/chat/save-chat`, {
          patientId: user._id,
          clinicId: user.clinicId._id || user.clinicId,
          role: "Client",
          message,
        });
      }

      // 2) Ask AI for a reply - NOW WITH EMERGENCY DETECTION
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat`,
        {
          message: message,
        }
      );

      const botMessage = {
        role: "bot",
        text: response.data.reply,
        severity: response.data.severity,
        emergency: response.data.emergency_trigger,
      };

      setChatHistory((prev) => [...prev, botMessage]);

      // 3) Check for emergency and trigger emergency UI
      if (response.data.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: response.data.severity,
          message: response.data.reply,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // 4) Save AI reply immediately
      if (user && user._id) {
        await axios.post(`${import.meta.env.VITE_API_URL}/chat/save-chat`, {
          patientId: user._id,
          clinicId: user.clinicId._id || user.clinicId,
          role: "ai",
          message: response.data.reply,
          severity: response.data.severity,
          emergency: response.data.emergency_trigger,
        });
      }

      // 5) Increment chat credits after successful chat
      if (user && user._id) {
        const creditResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/chat/increment-credits`,
          {
            patientId: user._id,
          }
        );
        setChatCredits(creditResponse.data);
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);

      let errorText = "Sorry, something went wrong. Please try again.";

      if (error.message.includes("clinic information not found")) {
        errorText =
          "Unable to identify your clinic. Please log out and log in again.";
      } else if (error.response?.status === 400) {
        errorText =
          "Invalid request. Please check your connection and try again.";
      } else if (error.response?.status === 500) {
        errorText = "Server error. Please try again in a moment.";
      }

      const errorMessage = {
        role: "bot",
        text: errorText,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Emergency contact handler
  const handleEmergencyContact = () => {
    // In a real app, this would trigger a call or connect to emergency services
    toast.info(
      "🚨 Connecting to emergency services... Please stay on the line."
    );

    // You can also auto-dial emergency numbers
    // window.location.href = 'tel:911';
  };

  // Close emergency banner
  const handleCloseEmergency = () => {
    setShowEmergency(false);
    setEmergencyData(null);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading, showEmergency]);

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      {/* Header - Mobile Optimized */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="bg-cyan-100 p-2 sm:p-3 rounded-full flex-shrink-0">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                AI Symptom Checker
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Get basic advice for your symptoms. This is not a substitute for
                professional medical advice.
              </p>
              {/* Chat Credits Display - Mobile Optimized */}
              <div className="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600 flex-shrink-0" />
                <span
                  className={`text-xs sm:text-sm font-medium truncate ${
                    chatCredits.canChat ? "text-cyan-600" : "text-red-600"
                  }`}
                >
                  {chatCredits.canChat
                    ? `${chatCredits.credits}/${chatCredits.maxCredits} chats left`
                    : "Limit reached"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-xs sm:text-sm text-cyan-700 hover:text-cyan-900 border border-cyan-200 hover:border-cyan-400 px-2 py-1 sm:px-3 sm:py-1 rounded-md whitespace-nowrap ml-2"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Emergency Banner - Shows when severe symptoms detected */}
      {showEmergency && emergencyData && (
        <div className="sticky top-16 bg-red-50 border-b border-red-200 p-3 sm:p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-red-100 p-2 rounded-full flex-shrink-0 mt-1">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-red-900 text-sm sm:text-base">
                  🚨 Medical Attention Required
                </h3>
                <button
                  onClick={handleCloseEmergency}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-red-800 text-xs sm:text-sm mb-3">
                {emergencyData.message}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleEmergencyContact}
                  className="flex items-center space-x-2 bg-red-600 text-white md:px-4 px-2 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Phone className="md:h-4 md:w-4" />
                  <span>Call Emergency</span>
                </button>
                <button className="flex items-center space-x-2 bg-white text-red-600 border border-red-600 md:px-4 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm">
                  <span>Contact Clinic</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages - Mobile Scrolling Fixed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg px-3 py-2 sm:px-4 sm:py-3 rounded-lg ${
                chat.role === "user"
                  ? "bg-cyan-600 text-white"
                  : chat.emergency
                  ? "bg-red-50 border border-red-200 text-red-900"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              {chat.role === "bot" && (
                <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <Bot
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      chat.emergency ? "text-red-600" : "text-cyan-600"
                    } flex-shrink-0`}
                  />
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      chat.emergency ? "text-red-600" : "text-cyan-600"
                    }`}
                  >
                    {chat.emergency ? "🚨 AI Assistant" : "AI Assistant"}
                  </span>
                  {chat.severity && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        chat.severity === "SEVERE"
                          ? "bg-red-100 text-red-800"
                          : chat.severity === "MODERATE"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {chat.severity}
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {chat.text}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white border border-gray-200 text-gray-900">
              <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600" />
                <span className="text-xs sm:text-sm font-medium text-cyan-600">
                  AI Assistant
                </span>
              </div>
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}

        {/* Rest of your existing components remain the same */}
        {/* Chat Limit Reached Message */}
        {!chatCredits.canChat && (
          <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-red-200">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
              <h3 className="font-medium text-red-900 text-sm sm:text-base">
                Daily Chat Limit Reached
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-red-800">
              You've used all 5 of your daily chat messages. Your chat credits
              will reset tomorrow. For urgent medical concerns, please contact
              your healthcare provider directly.
            </p>
          </div>
        )}

        {/* Sample health questions - Only show if no emergency and can chat */}
        {chatCredits.canChat && !showEmergency && (
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">
              Common Questions You Can Ask:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div
                onClick={() => setMessage("I have a headache and feel tired")}
                className="text-left p-2 sm:p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <p className="text-xs sm:text-sm text-blue-800">
                  "I have a headache and feel tired"
                </p>
              </div>
              <div
                onClick={() => setMessage("What are symptoms of flu?")}
                className="text-left p-2 sm:p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <p className="text-xs sm:text-sm text-blue-800">
                  "What are symptoms of flu?"
                </p>
              </div>
              <div
                onClick={() => setMessage("When should I see a doctor?")}
                className="text-left p-2 sm:p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <p className="text-xs sm:text-sm text-blue-800">
                  "When should I see a doctor?"
                </p>
              </div>
              <div
                onClick={() => setMessage("How to manage stress?")}
                className="text-left p-2 sm:p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <p className="text-xs sm:text-sm text-blue-800">
                  "How to manage stress?"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Health Tips - Hide during emergencies */}
        {!showEmergency && (
          <div className="bg-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-cyan-200 hidden sm:block">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              <h3 className="font-medium text-cyan-900 text-sm sm:text-base">
                Daily Health Reminder
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-cyan-800">
              Remember to stay hydrated throughout the day. Aim for 8 glasses of
              water to maintain optimal health and energy levels.
            </p>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Message Input - Mobile Optimized */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex space-x-2 sm:space-x-3">
          <input
            type="text"
            placeholder={
              !chatCredits.canChat
                ? "Daily chat limit reached"
                : showEmergency
                ? "Emergency detected - use buttons above"
                : "Type your message..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!chatCredits.canChat || showEmergency}
            className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none ${
              !chatCredits.canChat || showEmergency
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !chatCredits.canChat || showEmergency}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center justify-center min-w-[44px] ${
              !chatCredits.canChat || showEmergency
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800"
            } disabled:opacity-50 transition-colors`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
