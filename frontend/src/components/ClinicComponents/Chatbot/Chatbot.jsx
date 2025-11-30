import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ChatbotIcon from "./ChatbotIcon";
import ChatbotWindow from "./ChatbotWindow";
import { useSubscriptionPopup } from "../../../hooks/useSubscriptionPopup";
import SubscriptionPopup from "../SubscriptionPopup";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const { isPopupOpen, popupFeature, popupRequiredPlan, showPopup, hidePopup } =
    useSubscriptionPopup();

  console.log(user);
  const isNotPro = user.subscriptionPlan !== "pro";

  const toggleChat = () => {
    if (isNotPro) {
      showPopup("AI Chatbot Assistant", "pro");
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  // Only show chatbot for clinics (not patients)
  if (!user || user.role !== "Clinic") {
    return null;
  }

  return (
    <>
      <button onClick={toggleChat} className="cursor-pointer">
        <ChatbotIcon isNotPro={isNotPro} />
      </button>

      <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <SubscriptionPopup
        isOpen={isPopupOpen}
        onClose={hidePopup}
        featureName={popupFeature}
        requiredPlan={popupRequiredPlan}
        currentPlan={user.subscriptionPlan}
      />
    </>
  );
};

export default Chatbot;
