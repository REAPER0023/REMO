import { motion } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Trash2,
  Bot,
  Clock3,
  Settings,
} from "lucide-react";

import SearchBar from "./SearchBar";
import { useChat } from "../context/ChatContext";

function ChatSidebar() {
  const {
    chats,
    currentChatId,
    createChat,
    switchChat,
    deleteChat,
  } = useChat();

  return (
    <motion.aside
      className="sidebar glass"
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* =========================
          REMO HEADER
      ========================== */}

      <div className="remo-header">
        <div className="remo-avatar">
          <Bot size={30} />
        </div>

        <div className="remo-info">
          <h1>Remo</h1>

          <div className="remo-status">
            <span></span>
            <p>Your AI Study Companion</p>
          </div>
        </div>
      </div>

      {/* =========================
          NEW CHAT
      ========================== */}

      <motion.button
        className="new-chat-btn"
        onClick={createChat}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={21} strokeWidth={2.2} />
        <span>New Chat</span>
      </motion.button>

      {/* =========================
          SEARCH
      ========================== */}

      <div className="sidebar-search">
        <SearchBar />
      </div>

      {/* =========================
          RECENTS HEADER
      ========================== */}

      <div className="sidebar-title">
        <div className="title-left">
          <Clock3 size={18} />
          <span>Recents</span>
        </div>

        <span className="chat-count">
          {chats.length}
        </span>
      </div>

      {/* =========================
          CHAT LIST
      ========================== */}

      <div className="chat-list">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            className={`chat-item ${
              currentChatId === chat.id ? "active" : ""
            }`}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            onClick={() => switchChat(chat.id)}
          >
            <div className="chat-icon">
              <MessageSquare
                size={18}
                strokeWidth={1.9}
              />
            </div>

            <div className="chat-info">
              <h4>{chat.title}</h4>

              <span>
                {chat.messages?.length || 0} messages
              </span>
            </div>

            <button
              className="delete-btn"
              aria-label="Delete chat"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            >
              <Trash2 size={17} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* =========================
          SIDEBAR FOOTER
      ========================== */}

      <div className="sidebar-profile">
        <div className="profile-avatar">
          A
          <span></span>
        </div>

        <div className="profile-info">
          <strong>Atharva</strong>
          <small>Free Plan</small>
        </div>

        <button
          className="profile-settings"
          aria-label="Profile settings"
        >
          <Settings size={19} />
        </button>
      </div>
    </motion.aside>
  );
}

export default ChatSidebar;