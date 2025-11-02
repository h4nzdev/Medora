import {
  Bot,
  Send,
  User,
  Shield,
  Clock,
  AlertTriangle,
  Phone,
  Stethoscope,
  Zap,
  Sparkles,
  VolumeX,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Calendar,
  ArrowLeft,
  Mic,
  MicOff,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useVoiceRecognition } from "../../../hooks/useVoiceRecognition";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quickActions, setQuickActions] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [lastBotMessage, setLastBotMessage] = useState(null);
  const [showAppointmentButton, setShowAppointmentButton] = useState(false); // Added missing state
  const [isSending, setIsSending] = useState(false); // ADDED: Simple fix for duplicates

  // Voice Recognition
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    setTranscript,
  } = useVoiceRecognition();

  // Enhanced sample questions with categories
  const sampleQuestions = {
    symptoms: [
      "I have headache and fever",
      "Cough and sore throat for 3 days",
      "Stomach pain after eating",
      "Feeling dizzy and tired",
    ],
    general: [
      "What are flu symptoms?",
      "How to manage stress?",
      "When to see a doctor for fever?",
      "Healthy diet tips",
    ],
    appointment: [
      "How to book appointment?",
      "What to bring to clinic?",
      "Emergency contact number",
      "Clinic operating hours",
    ],
  };

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

  // Voice recognition transcript
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!isListening && transcript.trim() && !isSending) {
      // ADDED: isSending check
      handleSendMessage();
    }
  }, [isListening, transcript]);

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    } else {
      setChatHistory([
        {
          role: "bot",
          text: "👋 Hello! I'm Medora, your AI health assistant. I can help you with:\n\n• Symptom checking and basic advice\n• Health information and tips\n• Appointment guidance\n• Emergency assessment\n\n💡 You have 5 free messages today. Let's start with how you're feeling!",
          type: "welcome",
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
        text: "👋 Hello! I'm Medora, your AI health assistant. I can help you with:\n\n• Symptom checking and basic advice\n• Health information and tips\n• Appointment guidance\n• Emergency assessment\n\n💡 You have 5 free messages today. Let's start with how you're feeling!",
        type: "welcome",
      },
    ]);
    setShowEmergency(false);
    setEmergencyData(null);
    setQuickActions(true);
  };

  // Text-to-speech function
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance();
      speech.text = text.replace(/[👋💡🚨📋📍🕒❤️⚡🎯]/g, "");

      speech.rate = 1.2;
      speech.pitch = 1.1;
      speech.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Google") ||
          voice.name.includes("Samantha")
      );

      if (preferredVoice) {
        speech.voice = preferredVoice;
      }

      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];

      if (
        lastMessage.role === "bot" &&
        !lastMessage.type &&
        !isSpeaking &&
        !lastMessage.hasBeenSpoken
      ) {
        speakText(lastMessage.text);

        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            ...lastMessage,
            hasBeenSpoken: true,
          };
          return newHistory;
        });
      }
    }
  }, [chatHistory, isSpeaking]);

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // FIXED: handleSendMessage with simple duplicate prevention
  const handleSendMessage = async () => {
    // SIMPLE FIX: Prevent multiple sends
    if (isSending || !message.trim()) return;

    setIsSending(true); // Set sending flag

    // Check if user can still chat
    if (!chatCredits.canChat) {
      const errorMessage = {
        role: "bot",
        text: "❌ You've reached your daily chat limit of 5 messages. Please come back tomorrow for more assistance.\n\n📞 For urgent concerns, contact your healthcare provider directly.",
        type: "limit_reached",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      setIsSending(false);
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    setQuickActions(false);

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

      // 2) Ask AI for a reply
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
        showAppointmentButton: response.data.show_appointment_button || false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev, botMessage]);

      // Show appointment button
      if (response.data.show_appointment_button) {
        setShowAppointmentButton(true);
        setLastBotMessage(botMessage);
      } else {
        setShowAppointmentButton(false);
      }

      // 3) Check for emergency and trigger emergency UI
      if (response.data.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: response.data.severity,
          message: response.data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
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

      let errorText = "❌ Sorry, something went wrong. Please try again.";

      if (error.message.includes("clinic information not found")) {
        errorText =
          "❌ Unable to identify your clinic. Please log out and log in again.";
      } else if (error.response?.status === 400) {
        errorText =
          "❌ Invalid request. Please check your connection and try again.";
      } else if (error.response?.status === 500) {
        errorText = "❌ Server error. Please try again in a moment.";
      }

      const errorMessage = {
        role: "bot",
        text: errorText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsSending(false); // CLEAR: sending flag
    }
  };

  // Add this function with your other handlers
  const handleBookAppointment = () => {
    navigate("/book-appointment");

    if (lastBotMessage) {
      localStorage.setItem(
        "appointmentContext",
        JSON.stringify({
          reason: message,
          botResponse: lastBotMessage.text,
          timestamp: new Date().toISOString(),
        })
      );
    }
  };

  // Emergency contact handler
  const handleEmergencyContact = () => {
    toast.info(
      "🚨 Connecting to emergency services... Please stay on the line."
    );
    window.location.href = "tel:911";
  };

  const handleClinicContact = () => {
    toast.info("📞 Contacting your clinic...");
    window.location.href = "tel:+1234567890";
  };

  // Close emergency banner
  const handleCloseEmergency = () => {
    setShowEmergency(false);
    setEmergencyData(null);
  };

  // Quick action handler
  const handleQuickAction = (question) => {
    setMessage(question);
  };

  // Feedback handler
  const handleFeedback = (helpful) => {
    toast.success(`Thank you for your feedback!`);
  };

  // Back button handler
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading, showEmergency]);

  return (
    <div className="w-full h-full flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/30">
      {/* Enhanced Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-3 sm:p-4 lg:p-6 sticky top-16 left-0 right-0 z-10">
        <div className="flex items-center justify-between mx-auto">
          <button
            onClick={handleBack}
            className="flex-shrink-0 p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all duration-200 lg:hidden block"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          {/* Left Section - Back Button & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-1.5 sm:p-2 lg:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent truncate">
                  Medora AI
                </h1>
                <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full font-medium hidden sm:inline-block">
                  Beta
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base hidden xs:block">
                Your health companion
              </p>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Credits Display - Compact on mobile */}
            <div
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border ${
                chatCredits.canChat
                  ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-semibold">
                  {chatCredits.credits}/{chatCredits.maxCredits}
                </span>
              </div>
            </div>

            {/* Voice Control - Icon only on mobile */}
            <button
              onClick={
                isSpeaking
                  ? stopSpeaking
                  : () =>
                      speakText(chatHistory[chatHistory.length - 1]?.text || "")
              }
              className="p-1.5 sm:p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg sm:rounded-xl transition-all duration-200"
            >
              {isSpeaking ? (
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            {/* Clear Button - Smaller on mobile */}
            <button
              onClick={handleClearHistory}
              className="px-2 py-1.5 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Emergency Banner */}
      {showEmergency && emergencyData && (
        <div className="sticky top-16 sm:top-20 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 lg:p-6 shadow-lg z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Content Section */}
            <div className="flex items-start sm:items-center gap-4 flex-1">
              <div className="bg-white/20 p-2 sm:p-3 rounded-2xl flex-shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  🚨 Medical Emergency Detected
                </h3>
                <p className="text-red-100 text-xs sm:text-sm opacity-90 line-clamp-2">
                  {emergencyData.message}
                </p>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-2 sm:flex-nowrap flex-shrink-0">
              <button
                onClick={handleEmergencyContact}
                className="bg-white text-red-600 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Phone className="h-4 w-4" />
                <span>Call 911</span>
              </button>
              <button
                onClick={handleClinicContact}
                className="bg-red-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-red-800 transition-colors text-sm sm:text-base"
              >
                Contact Clinic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Chat Area - Fixed top spacing */}
      <div className="flex-1 overflow-y-auto lg:pb-32 pb-12">
        <div className="mx-auto px-">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] lg:max-w-2xl rounded-2xl p-4 lg:p-6 relative group my-4 ${
                  chat.role === "user"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg"
                    : chat.emergency
                    ? "bg-red-50 border-2 border-red-200 text-red-900"
                    : chat.type === "welcome"
                    ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 text-slate-800"
                    : "bg-white border border-slate-200 shadow-sm text-slate-800"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {chat.role === "bot" ? (
                      <>
                        <div
                          className={`p-1 rounded-xl ${
                            chat.emergency
                              ? "bg-red-100 text-red-600"
                              : chat.type === "welcome"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-cyan-100 text-cyan-600"
                          }`}
                        >
                          <Bot className="h-4 w-4" />
                        </div>
                        <span
                          className={`font-semibold text-sm ${
                            chat.emergency ? "text-red-700" : "text-cyan-700"
                          }`}
                        >
                          {chat.emergency ? "🚨 Emergency Alert" : "Medora AI"}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-1 rounded-xl bg-white/20">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm text-white/90">
                          You
                        </span>
                      </>
                    )}
                  </div>

                  {chat.timestamp && (
                    <span
                      className={`text-xs ${
                        chat.role === "user"
                          ? "text-white/70"
                          : "text-slate-500"
                      }`}
                    >
                      {chat.timestamp}
                    </span>
                  )}
                </div>
                {/* Message Content */}
                <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                  {chat.text}
                </p>

                {/* Message Footer */}
                {chat.role === "bot" && !chat.type && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => speakText(chat.text)}
                        className="p-1 text-slate-500 hover:text-cyan-600 transition-colors"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-slate-500">Helpful?</span>
                      <button
                        onClick={() => handleFeedback(true)}
                        className="p-1 text-slate-400 hover:text-green-500 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[90%] lg:max-w-2xl bg-white border border-slate-200 rounded-2xl p-4 lg:p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-100 rounded-xl">
                    <Bot className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quick Actions */}
          {quickActions && chatCredits.canChat && !showEmergency && (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 lg:p-8 shadow-lg mt-10">
              <div className="text-center mb-6">
                <Sparkles className="h-8 w-8 text-cyan-500 mx-auto mb-3" />
                <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-2">
                  Quick Start Questions
                </h3>
                <p className="text-slate-600 text-sm lg:text-base">
                  Choose a category or type your own question
                </p>
              </div>

              <div className="space-y-6">
                {/* Symptoms Category */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Stethoscope className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-slate-800">
                      Describe Symptoms
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sampleQuestions.symptoms.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(question)}
                        className="text-left p-3 bg-slate-50 hover:bg-red-50 hover:border-red-200 border border-slate-200 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                      >
                        <p className="text-sm text-slate-700">{question}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* General Health */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-slate-800">
                      Health Information
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sampleQuestions.general.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(question)}
                        className="text-left p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                      >
                        <p className="text-sm text-slate-700">{question}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appointment Related */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold text-slate-800">
                      Clinic & Appointments
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sampleQuestions.appointment.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(question)}
                        className="text-left p-3 bg-slate-50 hover:bg-green-50 hover:border-green-200 border border-slate-200 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                      >
                        <p className="text-sm text-slate-700">{question}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Chat Limit Message */}
          {!chatCredits.canChat && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 lg:p-8 text-center">
              <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg lg:text-xl font-semibold text-amber-800 mb-2">
                Daily Limit Reached
              </h3>
              <p className="text-amber-700 text-sm lg:text-base mb-4">
                You've used all your free messages for today. Your credits will
                reset in {Math.ceil(24 - new Date().getHours() + 1)} hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleClinicContact}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Clinic</span>
                </button>
                <button className="px-6 py-3 bg-white text-amber-600 border border-amber-300 rounded-xl font-semibold hover:bg-amber-50 transition-colors">
                  Learn About Premium
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Enhanced Input Area - Fixed to bottom with safe area */}
      <div className="bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] fixed bottom-0 left-0 right-0 safe-area-inset lg:pl-64">
        <div className="mx-auto px-4 py-4 lg:px-6 lg:py-5">
          {/* Main Input Container */}
          <div className="relative">
            <div className="flex items-stretch gap-2 lg:gap-3">
              {/* Text Input with Enhanced Styling */}
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder={
                    !isSupported
                      ? "Voice not supported in this browser"
                      : !chatCredits.canChat
                      ? "Daily limit reached - try again tomorrow"
                      : showEmergency
                      ? "Emergency detected - use emergency buttons above"
                      : isListening
                      ? "Listening... Speak now"
                      : "Type or tap mic to speak..."
                  }
                  value={isListening ? transcript : message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={
                    !chatCredits.canChat || showEmergency || !isSupported
                  }
                  className={`w-full pl-5 pr-14 py-3.5 lg:pl-6 lg:pr-16 lg:py-4 text-sm lg:text-base font-medium rounded-2xl lg:rounded-3xl transition-all duration-300 placeholder:text-slate-400 ${
                    !chatCredits.canChat || showEmergency || !isSupported
                      ? "bg-slate-50 border-2 border-slate-200 text-slate-400 cursor-not-allowed"
                      : isListening
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 text-green-900 shadow-lg shadow-green-100/50 ring-4 ring-green-100/50"
                      : "bg-white border-2 border-slate-200 text-slate-800 hover:border-cyan-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100/50 shadow-sm hover:shadow-md focus:shadow-lg"
                  } focus:outline-none`}
                />

                {/* Enhanced Voice Listening Indicator */}
                {isListening && (
                  <div className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <div
                            key={i}
                            className="w-1 lg:w-1.5 bg-green-500 rounded-full animate-pulse"
                            style={{
                              animationDelay: `${delay}s`,
                              height: i === 1 ? "12px" : "8px",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Clear Button */}
                {message && !isListening && (
                  <button
                    onClick={() => setMessage("")}
                    className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 text-xl font-light"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Voice Input Button - Enhanced */}
              <button
                onClick={toggleVoiceInput}
                disabled={!isSupported || !chatCredits.canChat || showEmergency}
                className={`relative overflow-hidden px-4 lg:px-5 py-3.5 lg:py-4 rounded-2xl lg:rounded-3xl font-semibold transition-all duration-300 flex items-center justify-center min-w-[56px] lg:min-w-[64px] group ${
                  !isSupported || !chatCredits.canChat || showEmergency
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : isListening
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/60 hover:scale-105 active:scale-95"
                    : "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:shadow-cyan-200/60 hover:scale-105 active:scale-95"
                }`}
              >
                {/* Animated background glow */}
                {!(!isSupported || !chatCredits.canChat || showEmergency) && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      isListening
                        ? "from-red-400 to-red-500"
                        : "from-cyan-400 to-cyan-500"
                    } opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                )}

                {isListening ? (
                  <MicOff className="h-5 w-5 lg:h-6 lg:w-6 relative z-10 animate-pulse" />
                ) : (
                  <Mic className="h-5 w-5 lg:h-6 lg:w-6 relative z-10" />
                )}
              </button>

              {/* Send Button - Enhanced */}
              <button
                onClick={handleSendMessage}
                disabled={
                  loading ||
                  isSending ||
                  !chatCredits.canChat ||
                  showEmergency ||
                  !message.trim()
                }
                className={`relative overflow-hidden px-5 lg:px-7 py-3.5 lg:py-4 rounded-2xl lg:rounded-3xl font-semibold transition-all duration-300 flex items-center gap-2 min-w-[56px] lg:min-w-[100px] justify-center group ${
                  !chatCredits.canChat ||
                  showEmergency ||
                  !message.trim() ||
                  isSending
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:shadow-cyan-300/60 hover:scale-105 active:scale-95"
                }`}
              >
                {/* Animated shimmer effect */}
                {!(
                  !chatCredits.canChat ||
                  showEmergency ||
                  !message.trim() ||
                  isSending
                ) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <Send
                  className={`h-4 w-4 lg:h-5 lg:w-5 relative z-10 ${
                    isSending ? "animate-pulse" : ""
                  }`}
                />
                <span className="hidden sm:inline relative z-10 font-semibold">
                  {isSending ? "Sending..." : "Send"}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Tips Section - Enhanced */}
          {chatCredits.canChat && !showEmergency && (
            <div className="flex items-center justify-between mt-3.5 lg:mt-4 px-1">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-1.5 text-xs lg:text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 group">
                  <Shield className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-400 group-hover:text-cyan-500 transition-colors duration-200" />
                  <span className="font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs lg:text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 group">
                  <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-400 group-hover:text-amber-500 transition-colors duration-200" />
                  <span className="font-medium">AI-Powered</span>
                </div>
              </div>
              <div className="text-right">
                {chatCredits.credits > 0 && (
                  <span className="text-xs lg:text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {chatCredits.credits} left today
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
