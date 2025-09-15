"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Message } from "@/types/doku-chat";
import { generateUUID } from "@/lib/utils";

type View = "chat" | "history" | "conversation";

interface ChatContextType {
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
  startNewChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [view, setView] = useState<View>("chat");

  const startNewChat = () => {
    setView("chat");
    const newSessionId = generateUUID();
    setSessionId(newSessionId);
    setMessages([
      {
        id: "initial-" + Date.now(),
        text: "Hello! I am Doku, your AI assistant. I will help you perform healthcare actions like creating appointments, sending reminders, generating reports, and managing patients. How can I help you today?",
        sender: "doku",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        setSessionId,
        messages,
        setMessages,
        view,
        setView,
        startNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
