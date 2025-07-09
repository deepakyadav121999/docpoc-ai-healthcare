import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Message,
  sendMessage,
  getChatSessions,
  getConversationMessages,
  Session,
  deleteSessions,
} from "@/api/doku";
import { Tabs, Tab, Checkbox, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import StyledButton from "@/components/common/Button/StyledButton";
import useColorMode from "@/hooks/useColorMode";

const IS_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

type View = "chat" | "history" | "conversation";

const ChatWindow = ({
  isOpen,
  toggleChat,
}: {
  isOpen: boolean;
  toggleChat: () => void;
}) => {
  const [colorMode] = useColorMode();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [view, setView] = useState<View>("chat");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  
  const { 
    isOpen: isDeleteModalOpen, 
    onOpen: onDeleteModalOpen, 
    onClose: onDeleteModalClose 
  } = useDisclosure();

  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setMessages([
        {
          id: "initial",
          text: "Hello! I am Doku, your AI assistant. How can I help you today?",
          sender: "doku",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
        setSelectionMode(false);
        setSelectedSessions([]);
    }
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, historyMessages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && sessionId) {
      const userMessage: Message = {
        id: new Date().toISOString(),
        text: inputValue,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      const currentInput = inputValue;
      setInputValue("");

      try {
        const dokuResponse = await sendMessage(currentInput, sessionId);
        setMessages((prevMessages) => [...prevMessages, dokuResponse]);
      } catch (error) {
        const errorMessage: Message = {
          id: new Date().toISOString(),
          text: "Sorry, something went wrong.",
          sender: "doku",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const loadSessions = async () => {
    setLoadingHistory(true);
    try {
      const fetchedSessions = await getChatSessions();
      setSessions(fetchedSessions);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadConversation = async (selectedSessionId: string) => {
    if (selectionMode) {
        const newSelection = selectedSessions.includes(selectedSessionId)
        ? selectedSessions.filter(id => id !== selectedSessionId)
        : [...selectedSessions, selectedSessionId];
        setSelectedSessions(newSelection);
        return;
    }

    setLoadingHistory(true);
    setView("conversation");
    try {
      const fetchedMessages = await getConversationMessages(selectedSessionId);
      setHistoryMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to load conversation", error);
    } finally {
      setLoadingHistory(false);
    }
  };
  
  const handleSessionClick = (session: Session) => {
    if (selectionMode) {
      toggleSelection(session.sessionId);
    } else {
      loadConversation(session.sessionId);
    }
  };

  const handleDeleteSessions = async () => {
    const sessionsToDelete = selectedSessions.filter(id => IS_UUID.test(id));
    if (sessionsToDelete.length === 0) {
      onDeleteModalClose();
      return;
    }

    try {
      await deleteSessions({ sessionIds: sessionsToDelete });
      setSessions(sessions.filter(s => !sessionsToDelete.includes(s.sessionId)));
      setSelectedSessions([]);
      setSelectionMode(false);
    } catch (error) {
      console.error("Failed to delete sessions", error);
    }
    onDeleteModalClose();
  };
  
  const toggleSelection = (sessionId: string) => {
    const newSelection = selectedSessions.includes(sessionId)
      ? selectedSessions.filter(id => id !== sessionId)
      : [...selectedSessions, sessionId];
    setSelectedSessions(newSelection);
  };

  const ChatView = (
    <>
      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col mb-4 ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`prose dark:prose-invert rounded-lg px-4 py-2 max-w-full ${
                msg.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-2 dark:bg-gray-dark"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>
            {msg.timestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-stroke dark:border-strokedark">
        <div className="relative">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full rounded-md border border-stroke dark:border-strokedark bg-transparent py-3 pl-4 pr-12 text-black dark:text-white focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            <svg
              className="w-6 h-6 text-black dark:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  const HistoryView = (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-stroke dark:border-strokedark">
        <div className="flex justify-end gap-2">
            <StyledButton
                label={selectionMode ? "Cancel" : "Select"}
                clickEvent={() => setSelectionMode(!selectionMode)}
                color="secondary"
            />
            {selectionMode && (
                <StyledButton
                    label="Delete"
                    clickEvent={onDeleteModalOpen}
                    color="danger"
                    disabled={selectedSessions.length === 0}
                />
            )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loadingHistory ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading sessions...</p>
        ) : (
          sessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => handleSessionClick(session)}
                className="p-3 mb-2 rounded-md cursor-pointer hover:bg-gray-2 dark:hover:bg-gray-dark border-b border-stroke dark:border-strokedark flex items-center"
              >
                {selectionMode && (
                  <div 
                    className="w-6 mr-4" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(session.sessionId);
                    }}
                  >
                      <Checkbox
                        isSelected={selectedSessions.includes(session.sessionId)}
                        onChange={() => toggleSelection(session.sessionId)}
                      />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-black dark:text-white truncate">
                    {session.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {session.messageCount} messages
                    </p>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );

  const ConversationView = (
    <>
      <div className="p-4 border-b border-stroke dark:border-strokedark">
        <button onClick={() => setView("history")} className="text-primary hover:underline">
          &larr; Back to History
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        {loadingHistory ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading conversation...</p>
        ) : (
          historyMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col mb-4 ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`prose dark:prose-invert rounded-lg px-4 py-2 max-w-full ${
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-2 dark:bg-gray-dark"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
              {msg.timestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );

  return (
    <>
    <div
      className={`fixed bottom-0 right-0 z-[9999] transition-all duration-300 ease-in-out
        md:bottom-28 md:right-8 md:max-w-xl w-full
        ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }
      `}
    >
      <div className={`bg-white dark:bg-gray-dark rounded-t-lg md:rounded-lg shadow-xl flex flex-col h-[85vh] md:h-[73vh] w-full`}>
        <div className="flex justify-between items-center p-4 border-b border-stroke dark:border-strokedark">
          <h3 className="text-lg font-medium text-black dark:text-white">
            Doku Chat
          </h3>
          <button onClick={toggleChat} className="text-black dark:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className={`p-2 ${view === "conversation" ? "hidden" : ""}`}>
          <Tabs
            color="primary"
            aria-label="Chat Tabs"
            radius="full"
            className="bg-gray-2 dark:bg-gray-dark rounded-full p-1 shadow-inner"
            selectedKey={view === 'conversation' ? 'history' : view}
            onSelectionChange={(key) => {
              if (key === "history") {
                setView("history");
                loadSessions();
              } else {
                setView("chat");
              }
            }}
          >
            <Tab key="chat" title="Chat" />
            <Tab key="history" title="History" />
          </Tabs>
        </div>

        {view === "chat" && ChatView}
        {view === "history" && HistoryView}
        {view === "conversation" && ConversationView}
      </div>
    </div>
    <Modal 
      isOpen={isDeleteModalOpen} 
      onClose={onDeleteModalClose} 
      classNames={{
        wrapper: "z-[99999]",
      }}
    >
        <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
                <p>Are you sure you want to delete {selectedSessions.length} session(s)? This action cannot be undone.</p>
            </ModalBody>
            <ModalFooter>
                <StyledButton label="Cancel" clickEvent={onDeleteModalClose} color="default" />
                <StyledButton 
                  label="Delete" 
                  clickEvent={handleDeleteSessions} 
                  color="danger"
                />
            </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  );
};

export default ChatWindow; 