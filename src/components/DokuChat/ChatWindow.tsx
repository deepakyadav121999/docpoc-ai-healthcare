import "regenerator-runtime/runtime";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Message,
  sendMessage,
  getChatSessions,
  getConversationMessages,
  Session,
  deleteSessions,
} from "@/api/doku";
import {
  Tabs,
  Tab,
  Checkbox,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import StyledButton from "@/components/common/Button/StyledButton";
import { useChat } from "@/components/Context/ChatContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import useColorMode from "@/hooks/useColorMode";

const ChatWindow = ({
  isOpen,
  toggleChat,
}: {
  isOpen: boolean;
  toggleChat: () => void;
}) => {
  const { sessionId, messages, setMessages, view, setView, startNewChat } =
    useChat();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [_colorMode] = useColorMode();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setInputValue(transcript);
  }, [transcript]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const conversationHistoryRef = useRef<HTMLDivElement>(null);
  const sessionHistoryRef = useRef<HTMLDivElement>(null);

  const [sessionsPage, setSessionsPage] = useState(1);
  const [hasMoreSessions, setHasMoreSessions] = useState(true);
  const [loadingMoreSessions, setLoadingMoreSessions] = useState(false);
  const [isRestoringScroll, setIsRestoringScroll] = useState(false);
  const oldScrollHeightRef = useRef(0);
  const [isThinking, setIsThinking] = useState(false);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  useEffect(() => {
    // Start the first chat session when the component mounts for the first time
    if (!sessionId) {
      startNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    // Clean up history selection state when the chat window is closed
    if (!isOpen) {
      setSelectionMode(false);
      setSelectedSessions([]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only scroll to bottom on the initial load of a conversation.
    // historyPage is 1 after loadConversation, and incremented on loadMore.
    if (historyPage === 1 && historyMessages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [historyMessages, historyPage]);

  useLayoutEffect(() => {
    if (isRestoringScroll && conversationHistoryRef.current) {
      conversationHistoryRef.current.scrollTop =
        conversationHistoryRef.current.scrollHeight -
        oldScrollHeightRef.current;
      setIsRestoringScroll(false);
    }
  }, [isRestoringScroll]);

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
      setIsThinking(true);

      try {
        const dokuResponse = await sendMessage(currentInput, sessionId);
        setMessages((prevMessages) => [...prevMessages, dokuResponse]);
      } catch (error) {
        console.log(error);
        const errorMessage: Message = {
          id: new Date().toISOString(),
          text: "${error}",
          sender: "doku",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  const loadSessions = async () => {
    setLoadingHistory(true);
    setSessionsPage(1);
    setHasMoreSessions(true);
    try {
      const fetchedSessions = await getChatSessions(10, 0);
      setSessions(fetchedSessions);
      if (fetchedSessions.length < 10) {
        setHasMoreSessions(false);
      }
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadMoreSessions = async () => {
    if (loadingMoreSessions || !hasMoreSessions) return;

    setLoadingMoreSessions(true);
    try {
      const fetchedSessions = await getChatSessions(10, sessionsPage * 10);
      if (fetchedSessions.length > 0) {
        setSessions((prev) => [...prev, ...fetchedSessions]);
        setSessionsPage((prev) => prev + 1);
      }
      if (fetchedSessions.length < 10) {
        setHasMoreSessions(false);
      }
    } catch (error) {
      console.error("Failed to load more sessions", error);
    } finally {
      setLoadingMoreSessions(false);
    }
  };

  const handleSessionScroll = () => {
    if (sessionHistoryRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        sessionHistoryRef.current;
      if (scrollHeight - scrollTop - clientHeight < 20) {
        loadMoreSessions();
      }
    }
  };

  const loadMoreConversation = async () => {
    if (loadingMore || !hasMoreHistory || !activeSessionId) return;

    setLoadingMore(true);
    try {
      const fetchedMessages = await getConversationMessages(
        activeSessionId,
        10,
        historyPage * 10,
      );
      if (fetchedMessages.length > 0) {
        if (conversationHistoryRef.current) {
          oldScrollHeightRef.current =
            conversationHistoryRef.current.scrollHeight;
          setIsRestoringScroll(true);
        }

        setHistoryMessages((prev) => [...fetchedMessages, ...prev]);
        setHistoryPage((prev) => prev + 1);
      }
      if (fetchedMessages.length < 10) {
        setHasMoreHistory(false);
      }
    } catch (error) {
      console.error("Failed to load more conversation", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleConversationScroll = () => {
    if (conversationHistoryRef.current) {
      const { scrollTop } = conversationHistoryRef.current;
      if (scrollTop < 1 && !loadingMore && hasMoreHistory) {
        loadMoreConversation();
      }
    }
  };

  const loadConversation = async (selectedSessionId: string) => {
    if (selectionMode) {
      const newSelection = selectedSessions.includes(selectedSessionId)
        ? selectedSessions.filter((id) => id !== selectedSessionId)
        : [...selectedSessions, selectedSessionId];
      setSelectedSessions(newSelection);
      return;
    }

    setLoadingHistory(true);
    setView("conversation");
    setHistoryPage(1);
    setHasMoreHistory(true);
    setActiveSessionId(selectedSessionId);
    try {
      const fetchedMessages = await getConversationMessages(
        selectedSessionId,
        10,
        0,
      );
      setHistoryMessages(fetchedMessages);
      if (fetchedMessages.length < 10) {
        setHasMoreHistory(false);
      }
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
    const sessionsToDelete = selectedSessions;
    if (sessionsToDelete.length === 0) {
      onDeleteModalClose();
      return;
    }

    try {
      await deleteSessions({ sessionIds: sessionsToDelete });
      setSessions(
        sessions.filter((s) => !sessionsToDelete.includes(s.sessionId)),
      );
      setSelectedSessions([]);
      setSelectionMode(false);
    } catch (error) {
      console.error("Failed to delete sessions", error);
    }
    onDeleteModalClose();
  };

  const toggleSelection = (sessionId: string) => {
    const newSelection = selectedSessions.includes(sessionId)
      ? selectedSessions.filter((id) => id !== sessionId)
      : [...selectedSessions, sessionId];
    setSelectedSessions(newSelection);
  };

  const MessageBubble = ({ msg }: { msg: Message }) => (
    <div
      className={`flex flex-col mb-6 ${
        msg.sender === "user" ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`prose dark:prose-invert rounded-2xl px-5 py-3 max-w-lg shadow-soft-xl dark:shadow-dark-soft-xl ${
          msg.sender === "user"
            ? "bg-primary-soft text-white rounded-br-none"
            : "bg-white dark:bg-gray-dark rounded-bl-none"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
      </div>
      {msg.timestamp && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );

  const renderMessagesWithDateSeparators = (messages: Message[]) => {
    let lastDate: string | null = null;
    const sortedMessages = messages.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    return sortedMessages.map((msg) => {
      if (!msg.timestamp) {
        return <MessageBubble key={msg.id} msg={msg} />;
      }

      const messageDate = new Date(msg.timestamp).toDateString();
      const showDateSeparator = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <React.Fragment key={msg.id}>
          {showDateSeparator && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 my-4">
              {new Date(msg.timestamp).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
          <MessageBubble msg={msg} />
        </React.Fragment>
      );
    });
  };

  const ChatView = (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
        {renderMessagesWithDateSeparators(messages)}
        {isThinking && (
          <div className="flex flex-col mb-6 items-start">
            <div
              className={`prose dark:prose-invert rounded-2xl px-5 py-3 max-w-lg shadow-soft-xl dark:shadow-dark-soft-xl bg-white dark:bg-gray-dark rounded-bl-none`}
            >
              <div className="flex items-center justify-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-transparent">
        <div className="relative shadow-soft-inset-xl dark:shadow-dark-soft-inset-xl rounded-full">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full rounded-full border-none bg-white dark:bg-gray-dark py-4 pl-6 pr-28 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-soft transition-all"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => {
                if (listening) {
                  SpeechRecognition.stopListening();
                } else {
                  resetTranscript();
                  SpeechRecognition.startListening({ continuous: true });
                }
              }}
              disabled={!browserSupportsSpeechRecognition}
              className={`p-2 rounded-full transition-all ${
                listening
                  ? "bg-red-500/20 text-red-500 scale-110"
                  : "bg-primary-soft/20 text-primary-soft"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
                <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
              </svg>
            </button>
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-primary-soft shadow-soft-md dark:shadow-dark-soft-md hover:scale-105 active:scale-95 transition-all"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryView = (
    <div className="relative flex-1 min-h-0">
      <div
        className="absolute inset-0 overflow-y-auto p-4"
        ref={sessionHistoryRef}
        onScroll={handleSessionScroll}
      >
        <div className="pt-20">
          {loadingHistory ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading sessions...
            </p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => handleSessionClick(session)}
                  className="p-4 rounded-2xl cursor-pointer transition-all duration-300 bg-white dark:bg-gray-dark shadow-soft-xl dark:shadow-dark-soft-xl hover:shadow-soft-2xl dark:hover:shadow-dark-soft-2xl flex items-center gap-4"
                >
                  {selectionMode && (
                    <div
                      className="w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(session.sessionId);
                      }}
                    >
                      <Checkbox
                        isSelected={selectedSessions.includes(
                          session.sessionId,
                        )}
                        onChange={() => toggleSelection(session.sessionId)}
                      />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-black dark:text-white truncate">
                      {session.lastMessage}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {session.messageCount} messages
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {loadingMoreSessions && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Loading more...
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white/30 dark:bg-black/30 backdrop-blur-xl">
        <div className="flex justify-end gap-2">
          <StyledButton
            label={selectionMode ? "Cancel" : "Select"}
            clickEvent={() => {
              if (selectionMode) {
                setSelectedSessions([]);
              }
              setSelectionMode(!selectionMode);
            }}
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
    </div>
  );

  const ConversationView = (
    <>
      <div className="p-4 border-b border-stroke dark:border-white/5">
        <button
          onClick={() => {
            setView("history");
            setHistoryMessages([]);
            setActiveSessionId(null);
          }}
          className="flex items-center gap-2 text-primary-soft hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to History
        </button>
      </div>
      <div
        className="flex-1 p-6 overflow-y-auto"
        ref={conversationHistoryRef}
        onScroll={handleConversationScroll}
      >
        {loadingMore && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Loading...
          </div>
        )}
        {loadingHistory ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading conversation...
          </p>
        ) : (
          renderMessagesWithDateSeparators(historyMessages)
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );

  return (
    <>
      <div
        className={`fixed bottom-0 right-0 z-[9999] transition-all duration-500 ease-in-out
        lg:bottom-[90px] lg:right-8 lg:max-w-2xl w-full
        ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }
      `}
      >
        <div
          className={`bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col h-[85vh] lg:h-[73vh] w-full overflow-hidden border border-white/30 dark:border-white/10`}
        >
          <div className="flex justify-between items-center p-5 border-b border-stroke dark:border-white/5">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Doku
              </h3>
              <button
                onClick={startNewChat}
                title="New Chat"
                className="p-1 rounded-full text-black dark:text-white hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={toggleChat}
              className="text-black dark:text-white hover:scale-110 transition-transform"
            >
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

          <div
            className={`p-2 bg-white/30 dark:bg-black/30 ${
              view === "conversation" ? "hidden" : ""
            }`}
          >
            <Tabs
              color="primary"
              aria-label="Chat Tabs"
              radius="full"
              classNames={{
                base: "w-full justify-center",
                tabList:
                  "bg-white/50 dark:bg-gray-dark/50 shadow-soft-inset-xl dark:shadow-dark-soft-inset-xl p-1.5",
                cursor:
                  "bg-primary-soft shadow-soft-xl dark:shadow-dark-soft-xl",
                tabContent: "group-data-[selected=true]:text-white",
              }}
              selectedKey={view === "conversation" ? "history" : view}
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
        backdrop="transparent"
        classNames={{
          wrapper: "z-[9999999]",
          base: "bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-white/30 dark:border-black/30 rounded-3xl",
          header: "text-black dark:text-white",
          body: "text-black dark:text-white",
        }}
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete {selectedSessions.length}{" "}
              session(s)? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <StyledButton
              label="Cancel"
              clickEvent={onDeleteModalClose}
              color="default"
              className="!bg-white dark:!bg-gray-dark !text-black dark:!text-white !shadow-soft-xl hover:!shadow-soft-2xl dark:!shadow-dark-soft-xl dark:hover:!shadow-dark-soft-2xl"
            />
            <StyledButton
              label="Delete"
              clickEvent={handleDeleteSessions}
              color="danger"
              className="!text-white !shadow-soft-md dark:!shadow-dark-soft-md"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatWindow;
