import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  chatWithClinicAI,
  formatClinicInsights,
} from "../../../services/clinic_services/clinicAIService";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Bot,
  User,
} from "lucide-react";

const ChatbotWindow = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Load chat history from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedChat = localStorage.getItem("clinicChatHistory");
      if (savedChat) {
        // Parse and fix timestamps
        const parsedMessages = JSON.parse(savedChat);
        const fixedMessages = parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // Convert string back to Date
        }));
        setMessages(fixedMessages);
      } else {
        // Welcome message
        const welcomeMessage = {
          id: 1,
          text: `Hello ${
            user?.contactPerson || "Clinic Staff"
          }! I'm your Medora Clinic AI assistant. How can I help with clinic operations today?`,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, user]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("clinicChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice recognition
  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  // Text-to-speech
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.rate = 1;
      speech.pitch = 1;

      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(speech);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: `Hello ${
          user?.contactPerson || "Clinic Staff"
        }! I'm your Medora Clinic AI assistant. How can I help with clinic operations today?`,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    localStorage.removeItem("clinicChatHistory");
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    // Handle both Date objects and strings
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const data = await chatWithClinicAI(message);
      const cleanedResponse = data.ai_response.reply.replace(/\*/g, " ");
      const formattedClinicData = formatClinicInsights(data.clinic_data);

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

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
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
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Chat Window */}
          <motion.div
            className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-t-xl text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Medora Clinic AI</h3>
                <p className="text-sm opacity-90">Operations Assistant</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${msg.isBot ? "" : "flex justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 ${
                      msg.isBot
                        ? msg.isError
                          ? "bg-red-100 border border-red-300 text-red-800"
                          : "bg-white border border-gray-200 text-gray-800"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.isBot ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {msg.isBot ? "Medora AI" : "You"}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                    {/* Clinic Data */}
                    {msg.clinicData && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                          <span>Today's Appointments:</span>
                          <span className="font-semibold">
                            {msg.clinicData.todaysAppointments}
                          </span>
                          <span>Pending:</span>
                          <span className="font-semibold text-orange-500">
                            {msg.clinicData.pendingAppointments}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Message Actions */}
                    {msg.isBot && !msg.isError && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={() =>
                            isSpeaking ? stopSpeaking() : speakText(msg.text)
                          }
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title={isSpeaking ? "Stop speaking" : "Read aloud"}
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="mb-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-3 max-w-[85%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about clinic operations..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={isLoading}
                />

                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Voice input"
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-cyan-500 text-white px-3 py-2 rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatbotWindow;
