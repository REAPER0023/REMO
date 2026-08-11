import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SettingsContext = createContext();

const defaultSettings = {
  name: "Atharva",

  voiceEnabled: true,
  voiceLanguage: "en-IN",

  responseStyle: "Friendly",

  speechRate: 0.88,
  speechPitch: 0.65,

  saveChatHistory: true,
  enterToSend: true,

  trackProgress: true,
  dailyGoal: 60,
};

function loadSettings() {
  const saved = localStorage.getItem("remoSettings");

  if (!saved) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(saved),
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] =
    useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(
      "remoSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}