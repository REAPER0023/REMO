import { Send, Mic, MicOff, Paperclip, X } from "lucide-react";
import { useState, useRef } from "react";
import { useChat } from "../context/ChatContext";

function ChatInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const recognitionRef = useRef(null);

  // Remembers whether the current message came from the microphone
  const voiceInputRef = useRef(false);

  const { setMessages } = useChat();
  // =========================================
// FILE ATTACHMENT
// =========================================

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setSelectedFile(file);

  console.log("Selected file:", file.name);
};

const removeSelectedFile = () => {
  setSelectedFile(null);
};

  // =========================================
  // REMO VOICE RESPONSE
  // =========================================

  const speakResponse = (text) => {
    if (!window.speechSynthesis) {
      console.log("Speech synthesis is not supported.");
      return;
    }

    // Stop any previous speech
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[*_#>`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n+/g, " ")
      .trim();

    if (!cleanText) return;

    const speech = new SpeechSynthesisUtterance(cleanText);

    // =========================================
    // REMO VOICE STYLE
    // =========================================

    speech.lang = "en-IN";
    speech.rate = 0.88;
    speech.pitch = 0.65;
    speech.volume = 1;

    speech.onstart = () => {
      setSpeaking(true);
    };

    speech.onend = () => {
      setSpeaking(false);
    };

    speech.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // =========================================
  // MICROPHONE
  // =========================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    // Stop listening
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setListening(true);
      voiceInputRef.current = true;
    };

  recognition.onresult = (event) => {
  let finalTranscript = "";
  let interimTranscript = "";

  for (
    let i = event.resultIndex;
    i < event.results.length;
    i++
  ) {
    const transcript =
      event.results[i][0].transcript;

    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript += transcript;
    }
  }

  if (finalTranscript) {
    setText((prev) =>
      prev.trim()
        ? `${prev} ${finalTranscript}`
        : finalTranscript
    );
  }

  voiceInputRef.current = true;
};
    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
      voiceInputRef.current = false;
    };

  recognition.onend = () => {
  setListening(false);
};
    recognitionRef.current = recognition;

    recognition.start();
  };

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async () => {
    if (!text.trim() || loading) return;

    // Remember if this message came from voice
    const wasVoiceInput = voiceInputRef.current;

    const prompt = text.trim();

    const userMessage = {
      sender: "user",
      text: prompt,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        sender: "ai",
        text: "⏳ Remo is thinking...",
        loading: true,
      },
    ]);

    setText("");
    setLoading(true);

    try {
      const response = await fetch(
  "https://remo-backend-siq4.onrender.com/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: prompt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      // =========================================
      // SPEAK REMO RESPONSE
      // =========================================

      if (wasVoiceInput && data.reply) {
        speakResponse(data.reply);
      }

      // =========================================
      // UPDATE AI MESSAGE
      // =========================================

      setMessages((prev) => {
        const updated = [...prev];

        // Remove "Remo is thinking..."
        updated.pop();

        updated.push({
          sender: "ai",
          text:
            data.reply ||
            "Sorry, Remo didn't return a response.",
        });

        return updated;
      });

      // Reset voice state
      voiceInputRef.current = false;

    } catch (error) {
      console.error("Backend Error:", error);

      setMessages((prev) => {
        const updated = [...prev];

        // Remove thinking message
        updated.pop();

        updated.push({
          sender: "ai",
          text: "❌ Unable to connect to Remo backend.",
        });

        return updated;
      });

      voiceInputRef.current = false;

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
  <div className="chat-input">

    {/* SELECTED FILE */}

    {selectedFile && (
      <div className="selected-file">
        <div className="selected-file-info">
          <Paperclip size={16} />

          <span title={selectedFile.name}>
            {selectedFile.name}
          </span>
        </div>

        <button
          type="button"
          className="remove-file-btn"
          onClick={removeSelectedFile}
          title="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    )}

    {/* ATTACHMENT */}

    <label
      className="icon-btn attachment-btn"
      title="Attach file"
    >
      <Paperclip size={20} />

  <input
    type="file"
    hidden
    onChange={handleFileSelect}
  />
</label>

      {/* TEXT INPUT */}

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);

          // If user manually types, don't speak response
          if (e.target.value.trim()) {
            voiceInputRef.current = false;
          }
        }}
        disabled={loading}
        placeholder={
          loading
            ? "Remo is thinking..."
            : listening
            ? "Listening..."
            : speaking
            ? "Remo is speaking..."
            : "Ask Remo anything..."
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      {/* MICROPHONE */}

      <button
        type="button"
        className={`icon-btn ${
          listening ? "mic-listening" : ""
        }`}
        onClick={startListening}
        disabled={loading}
        title={
          listening
            ? "Stop listening"
            : "Voice input"
        }
      >
        {listening ? (
          <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}
      </button>

      {/* SPEAKING INDICATOR */}

      {speaking && (
        <div
          className="remo-speaking"
          title="Remo is speaking"
        >
          🔊
        </div>
      )}

      {/* SEND */}

      <button
        type="button"
        className="send-btn"
        onClick={sendMessage}
        disabled={loading}
        title="Send message"
      >
        <Send size={18} />
      </button>

    </div>
  );
}

export default ChatInput;