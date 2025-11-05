import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ChatbotIcon from "./ChatbotIcon";
import ChatbotWindow from "./ChatbotWindow";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Only show chatbot for clinics (not patients)
  if (!user || user.role !== "Clinic") {
    return null;
  }

  return (
    <>
      <div onClick={toggleChat}>
        <ChatbotIcon />
      </div>
      <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Chatbot;
