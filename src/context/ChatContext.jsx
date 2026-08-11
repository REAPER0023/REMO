import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const defaultAIMessage = {
  sender: "ai",
  text: "👋Hey I'm Remo. What would you like to study today?",
};

const createNewChat = () => ({
  id: Date.now().toString(),
  title: "New Chat",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  pinned: false,
  messages: [defaultAIMessage],
});

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("remoChats");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [createNewChat()];
      }
    }

    return [createNewChat()];
  });

  const [currentChatId, setCurrentChatId] = useState(() => {
    return localStorage.getItem("currentChatId") || null;
  });

  useEffect(() => {
    if (!currentChatId && chats.length > 0) {
      setCurrentChatId(chats[0].id);
    }
  }, [currentChatId, chats]);

  useEffect(() => {
    localStorage.setItem("remoChats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem("currentChatId", currentChatId);
    }
  }, [currentChatId]);

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) || chats[0];

  const messages = Array.isArray(currentChat?.messages)
    ? currentChat.messages
    : [];

  function setMessages(updater) {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== currentChatId) {
          return chat;
        }

        const updatedMessages =
          typeof updater === "function"
            ? updater(chat.messages || [])
            : updater;

        let updatedTitle = chat.title;

        // Automatically create a title from the first user message
        if (
          chat.title === "New Chat" &&
          updatedMessages.length > 1
        ) {
          const firstUserMessage = updatedMessages.find(
            (message) => message.sender === "user"
          );

          if (firstUserMessage?.text) {
            updatedTitle =
              firstUserMessage.text.length > 30
                ? firstUserMessage.text.substring(0, 30) + "..."
                : firstUserMessage.text;
          }
        }

        return {
          ...chat,
          title: updatedTitle,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
      })
    );
  }

  function createChat() {
    const newChat = createNewChat();

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  }

  function switchChat(id) {
    setCurrentChatId(id);
  }

  function deleteChat(id) {
    const updated = chats.filter((chat) => chat.id !== id);

    if (updated.length === 0) {
      const newChat = createNewChat();

      setChats([newChat]);
      setCurrentChatId(newChat.id);

      return;
    }

    setChats(updated);

    if (currentChatId === id) {
      setCurrentChatId(updated[0].id);
    }
  }

  function renameChat(id, title) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              title,
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        currentChatId,

        messages,
        setMessages,

        createChat,
        switchChat,
        deleteChat,
        renameChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}