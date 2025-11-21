import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ChatbotIcon from "./ChatbotIcon";
import ChatbotWindow from "./ChatbotWindow";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user);
  const isNotPro = user.subscriptionPlan !== "pro";

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Only show chatbot for clinics (not patients)
  if (!user || user.role !== "Clinic") {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleChat}
        disabled={isNotPro}
        className={`${isNotPro ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <ChatbotIcon isNotPro={isNotPro} />
      </button>

      <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Chatbot;
