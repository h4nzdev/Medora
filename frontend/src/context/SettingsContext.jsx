import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Load from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("app-settings");
    return saved
      ? JSON.parse(saved)
      : {
          notifications: true,
          soundEnabled: true,
          // Add more settings here as needed
        };
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const value = {
    settings,
    updateSetting,
    // Convenience methods
    toggleNotifications: () =>
      updateSetting("notifications", !settings.notifications),
    toggleSound: () => updateSetting("soundEnabled", !settings.soundEnabled),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
