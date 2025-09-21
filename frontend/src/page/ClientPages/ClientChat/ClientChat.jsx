import { Bot, Send, User, Shield, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

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
  const { user } = useContext(AuthContext);

  console.log(chatHistory);

  // Function to fetch chat credits
  const fetchChatCredits = async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/credits/${user._id}`
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
        await axios.post("http://localhost:3000/chat/save-chat", {
          patientId: user._id,
          role: "Client",
          message,
        });
      }

      // 2) Ask AI for a reply
      const response = await axios.post("http://localhost:3000/chat", {
        message: message,
      });

      const botMessage = {
        role: "bot",
        text: response.data.reply,
      };

      setChatHistory((prev) => [...prev, botMessage]);

      // 3) Save AI reply immediately
      if (user && user._id) {
        await axios.post("http://localhost:3000/chat/save-chat", {
          patientId: user._id,
          role: "ai",
          message: response.data.reply,
        });
      }

      // 4) Increment chat credits after successful chat
      if (user && user._id) {
        const creditResponse = await axios.post(
          "http://localhost:3000/chat/increment-credits",
          {
            patientId: user._id,
          }
        );
        setChatCredits(creditResponse.data);
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = {
        role: "bot",
        text: "Sorry, something went wrong. Please try again.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // no buffered save; messages persist immediately

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-100 p-3 rounded-full">
              <Bot className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                AI Symptom Checker
              </h1>
              <p className="text-gray-600">
                Get basic advice for your symptoms. This is not a substitute for
                professional medical advice.
              </p>
              {/* Chat Credits Display */}
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="h-4 w-4 text-cyan-600" />
                <span
                  className={`text-sm font-medium ${
                    chatCredits.canChat ? "text-cyan-600" : "text-red-600"
                  }`}
                >
                  {chatCredits.canChat
                    ? `${chatCredits.credits}/${chatCredits.maxCredits} chats remaining today`
                    : "Daily chat limit reached"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-sm text-cyan-700 hover:text-cyan-900 border border-cyan-200 hover:border-cyan-400 px-3 py-1 rounded-md"
          >
            Clear history
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                chat.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              {chat.role === "bot" && (
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-600">
                    AI Assistant
                  </span>
                </div>
              )}
              <p className="md:text-lg text-sm">{chat.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-600">
                  AI Assistant
                </span>
              </div>
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}

        {/* Chat Limit Reached Message */}
        {!chatCredits.canChat && (
          <div className="bg-red-50 rounded-xl p-4 lg:p-6 border border-red-200">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-900">
                Daily Chat Limit Reached
              </h3>
            </div>
            <p className="text-sm text-red-800">
              You've used all 5 of your daily chat messages. Your chat credits
              will reset tomorrow. For urgent medical concerns, please contact
              your healthcare provider directly.
            </p>
          </div>
        )}

        {/* Sample health questions */}
        {chatCredits.canChat && (
          <div className="bg-blue-50 rounded-xl p-4 lg:p-6 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">
              Common Questions You Can Ask:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div
                onClick={() => setMessage("I have a headache and feel tired")}
                className="text-left p-3 bg-white rounded-lg border border-blue-200 cursor-default select-none"
              >
                <p className="text-sm text-blue-800">
                  "I have a headache and feel tired"
                </p>
              </div>
              <div
                onClick={() => setMessage("What are symptoms of flu?")}
                className="text-left p-3 bg-white rounded-lg border border-blue-200 cursor-default select-none"
              >
                <p className="text-sm text-blue-800">
                  "What are symptoms of flu?"
                </p>
              </div>
              <div
                onClick={() => setMessage("When should I see a doctor?")}
                className="text-left p-3 bg-white rounded-lg border border-blue-200 cursor-default select-none"
              >
                <p className="text-sm text-blue-800">
                  "When should I see a doctor?"
                </p>
              </div>
              <div
                onClick={() => setMessage("How to manage stress?")}
                className="text-left p-3 bg-white rounded-lg border border-blue-200 cursor-default select-none"
              >
                <p className="text-sm text-blue-800">"How to manage stress?"</p>
              </div>
            </div>
          </div>
        )}

        {/* Health Tips */}
        <div className="bg-cyan-50 rounded-xl p-4 lg:p-6 border border-cyan-200 md:block hidden">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-5 w-5 text-cyan-600" />
            <h3 className="font-medium text-cyan-900">Daily Health Reminder</h3>
          </div>
          <p className="text-sm text-cyan-800">
            Remember to stay hydrated throughout the day. Aim for 8 glasses of
            water to maintain optimal health and energy levels.
          </p>
        </div>

        <div ref={bottomRef}></div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 lg:p-6">
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder={
              !chatCredits.canChat
                ? "Daily chat limit reached"
                : "Type your message..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!chatCredits.canChat}
            className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none ${
              !chatCredits.canChat ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !chatCredits.canChat}
            className={`px-6 py-3 rounded-lg flex items-center ${
              !chatCredits.canChat
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-cyan-600 text-white hover:bg-cyan-700"
            } disabled:opacity-50`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
