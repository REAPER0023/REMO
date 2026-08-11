import { useEffect, useRef } from "react";
import "../styles/chat.css";   // <-- Add this line

import ChatSidebar from "../components/ChatSidebar";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import { useChat } from "../context/ChatContext";

function Chat() {
  const { messages } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-page">
      <ChatSidebar />

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