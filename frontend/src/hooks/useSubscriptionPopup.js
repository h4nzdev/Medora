"use client";

import { useState } from "react";

export const useSubscriptionPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupFeature, setPopupFeature] = useState("");
  const [popupRequiredPlan, setPopupRequiredPlan] = useState("pro");

  const showPopup = (featureName = "Premium Feature", requiredPlan = "pro") => {
    setPopupFeature(featureName);
    setPopupRequiredPlan(requiredPlan);
    setIsPopupOpen(true);
  };

  const hidePopup = () => {
    setIsPopupOpen(false);
  };

  return {
    isPopupOpen,
    popupFeature,
    popupRequiredPlan,
    showPopup,
    hidePopup,
  };
};
