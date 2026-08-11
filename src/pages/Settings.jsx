import { useSettings } from "../context/SettingsContext";
import {
  Bot,
  MessageSquare,
  Brain,
  Database,
  Trash2,
  Volume2,
  Send,
  BarChart3,
  RotateCcw,
} from "lucide-react";

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${
        enabled ? "active" : ""
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span />
    </button>
  );
}

function Settings() {
  const {
    settings,
    updateSetting,
    resetSettings,
  } = useSettings();

  const clearChats = () => {
    const confirmed = window.confirm(
      "Delete all saved chats? This cannot be undone."
    );

    if (!confirmed) return;

    localStorage.removeItem("remoChats");
    localStorage.removeItem("currentChatId");

    window.location.reload();
  };

  return (
    <main className="settings-page">

      <div className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage your Remo experience
        </p>
      </div>


      

      {/* REMO */}

      <section className="settings-card">

        <div className="settings-section-title">

          <Bot size={20} />

          <div>
            <h2>Remo</h2>

            <p>
              Configure your AI companion
            </p>
          </div>

        </div>


        {/* VOICE */}

        <div className="settings-row">

          <div className="settings-row-info">

            <div className="settings-icon">
              <Volume2 size={18} />
            </div>

            <div>

              <strong>
                Voice responses
              </strong>

              <span>
                Allow Remo to speak responses
              </span>

            </div>

          </div>

          <Toggle
            enabled={settings.voiceEnabled}
            onChange={(value) =>
              updateSetting(
                "voiceEnabled",
                value
              )
            }
          />

        </div>


        {/* LANGUAGE */}

        <div className="settings-row">

          <div className="settings-row-info">

            <div>
              <strong>
                Voice language
              </strong>

              <span>
                Language used by speech recognition
              </span>
            </div>

          </div>

          <select
            value={settings.voiceLanguage}
            onChange={(e) =>
              updateSetting(
                "voiceLanguage",
                e.target.value
              )
            }
            className="settings-select"
          >

            <option value="en-IN">
              English (India)
            </option>

            <option value="en-US">
              English (US)
            </option>

            <option value="en-GB">
              English (UK)
            </option>

          </select>

        </div>


        {/* RESPONSE STYLE */}

        <div className="settings-row">

          <div className="settings-row-info">

            <div>
              <strong>
                Response style
              </strong>

              <span>
                How Remo communicates with you
              </span>
            </div>

          </div>

          <select
            value={settings.responseStyle}
            onChange={(e) =>
              updateSetting(
                "responseStyle",
                e.target.value
              )
            }
            className="settings-select"
          >

            <option>
              Friendly
            </option>

            <option>
              Professional
            </option>

            <option>
              Concise
            </option>

            <option>
              Detailed
            </option>

          </select>

        </div>


        {/* SPEECH RATE */}

        <div className="settings-row">

          <div className="settings-row-info">

            <div>
              <strong>
                Speaking speed
              </strong>

              <span>
                {settings.speechRate.toFixed(2)}x
              </span>
            </div>

          </div>

          <input
            type="range"
            min="0.5"
            max="1.3"
            step="0.05"
            value={settings.speechRate}
            onChange={(e) =>
              updateSetting(
                "speechRate",
                Number(e.target.value)
              )
            }
          />

        </div>


        {/* SPEECH PITCH */}

        <div className="settings-row">

          <div className="settings-row-info">

            <div>
              <strong>
                Voice pitch
              </strong>

              <span>
                {settings.speechPitch.toFixed(2)}
              </span>
            </div>

          </div>

          <input
            type="range"
            min="0.4"
            max="1.4"
            step="0.05"
            value={settings.speechPitch}
            onChange={(e) =>
              updateSetting(
                "speechPitch",
                Number(e.target.value)
              )
            }
          />

        </div>

      </section>


      {/* CHAT */}

      <section className="settings-card">

        <div className="settings-section-title">

          <MessageSquare size={20} />

          <div>
            <h2>Chat</h2>

            <p>
              Control your conversations
            </p>
          </div>

        </div>


        <div className="settings-row">

          <div className="settings-row-info">

            <div className="settings-icon">
              <Database size={18} />
            </div>

            <div>

              <strong>
                Save chat history
              </strong>

              <span>
                Keep conversations stored locally
              </span>

            </div>

          </div>

          <Toggle
            enabled={settings.saveChatHistory}
            onChange={(value) =>
              updateSetting(
                "saveChatHistory",
                value
              )
            }
          />

        </div>


        <div className="settings-row">

          <div className="settings-row-info">

            <div className="settings-icon">
              <Send size={18} />
            </div>

            <div>

              <strong>
                Enter to send
              </strong>

              <span>
                Press Enter to send messages
              </span>

            </div>

          </div>

          <Toggle
            enabled={settings.enterToSend}
            onChange={(value) =>
              updateSetting(
                "enterToSend",
                value
              )
            }
          />

        </div>

      </section>


      {/* STUDY */}

      <section className="settings-card">

        <div className="settings-section-title">

          <Brain size={20} />

          <div>
            <h2>Study</h2>

            <p>
              Personalize your study experience
            </p>

          </div>

        </div>


        <div className="settings-row">

          <div className="settings-row-info">

            <div className="settings-icon">
              <BarChart3 size={18} />
            </div>

            <div>

              <strong>
                Track study progress
              </strong>

              <span>
                Record your study activity
              </span>

            </div>

          </div>

          <Toggle
            enabled={settings.trackProgress}
            onChange={(value) =>
              updateSetting(
                "trackProgress",
                value
              )
            }
          />

        </div>


        <div className="settings-row">

          <div className="settings-row-info">

            <div>
              <strong>
                Daily study goal
              </strong>

              <span>
                Target study time
              </span>
            </div>

          </div>

          <select
            value={settings.dailyGoal}
            onChange={(e) =>
              updateSetting(
                "dailyGoal",
                Number(e.target.value)
              )
            }
            className="settings-select"
          >

            <option value={30}>
              30 min
            </option>

            <option value={60}>
              60 min
            </option>

            <option value={90}>
              90 min
            </option>

            <option value={120}>
              120 min
            </option>

          </select>

        </div>

      </section>


      {/* DATA */}

      <section className="settings-card">

        <div className="settings-section-title">

          <Database size={20} />

          <div>

            <h2>Data</h2>

            <p>
              Manage your stored information
            </p>

          </div>

        </div>


        <button
          className="clear-chats-btn"
          onClick={clearChats}
        >

          <Trash2 size={17} />

          Clear all chats

        </button>


        <button
          className="reset-settings-btn"
          onClick={resetSettings}
        >

          <RotateCcw size={17} />

          Reset settings

        </button>

      </section>

    </main>
  );
}

export default Settings;