import { useEffect, useRef, useState } from "react";
import "../styles/chat.css";

import ChatSidebar from "../components/ChatSidebar";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import { useChat } from "../context/ChatContext";

function Chat() {
  const { messages } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className={`chat-page ${sidebarOpen ? "sidebar-open" : ""}`}>

      {/* Mobile top bar */}
      <header className="mobile-chat-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open chat menu"
        >
          ☰
        </button>

        <div className="mobile-chat-title">
          <span className="mobile-remo-icon">🤖</span>
          <span>Remo</span>
        </div>
      </header>

      {/* Dark overlay when sidebar is open */}
      <div
        className="mobile-sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="mobile-sidebar-wrapper">
        <button
          className="mobile-close-sidebar"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close chat menu"
        >
          ✕
        </button>

        <ChatSidebar />
      </div>

      {/* Main chat */}
      <main className="chat-main">

        <div className="messages">
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              sender={msg.sender}
              text={msg.text}
              loading={msg.loading}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput />

      </main>
    </div>
  );
}

export default Chat;