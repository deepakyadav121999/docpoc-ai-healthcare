"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  sendMessage,
  getChatSessions,
  getConversationMessages,
  deleteSessions,
} from "@/api/doku-chat";
import { Message, Session } from "@/types/doku-chat";
import { useChat } from "@/components/Context/ChatContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const AIChatInterface = () => {
  const { sessionId, messages, setMessages, startNewChat } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setInputValue(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!sessionId) {
      startNewChat();
    }
  }, [sessionId, startNewChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload images (JPEG, PNG, GIF, WebP) or PDF files.`);
        continue;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      setUploadedFiles(prev => [...prev, file]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateStreamingResponse = async (fullText: string, onUpdate: (text: string) => void) => {
    setIsStreaming(true);
    setStreamingMessage("");
    
    const words = fullText.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      onUpdate(currentText);
      
      // Faster streaming - reduced delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 20));
    }
    
    setIsStreaming(false);
    return currentText;
  };

  const handleSendMessage = async () => {
    if ((inputValue.trim() || uploadedFiles.length > 0) && sessionId) {
      let messageText = inputValue;
      
      // Add file information to message if files are uploaded
      if (uploadedFiles.length > 0) {
        const fileInfo = uploadedFiles.map(file => 
          `📎 ${file.name} (${formatFileSize(file.size)})`
        ).join('\n');
        messageText = messageText ? `${messageText}\n\n${fileInfo}` : `Uploaded files:\n${fileInfo}`;
      }

      const userMessage: Message = {
        id: new Date().toISOString(),
        text: messageText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      const currentInput = inputValue;
      setInputValue("");
      setUploadedFiles([]);
      setIsThinking(true);

      try {
        // For testing purposes - generate sample responses
        let testResponse = "";
        
        if (currentInput.toLowerCase().includes("patient")) {
          testResponse = "I'll help you create a new patient record. Please provide the following information:\n\n• Patient's full name\n• Date of birth\n• Contact information (phone, email)\n• Address\n• Emergency contact details\n• Medical history (if any)\n• Insurance information\n\nOnce you provide these details, I can create the patient record in the system and assign a unique patient ID.";
        } else if (currentInput.toLowerCase().includes("appointment")) {
          testResponse = "I can help you schedule an appointment. Here's what I need to know:\n\n• Patient name or ID\n• Preferred date and time\n• Type of appointment (consultation, follow-up, procedure)\n• Doctor/physician preference\n• Reason for the appointment\n• Any special requirements\n\nI'll check availability and book the appointment for you. I can also send WhatsApp reminders to the patient once confirmed.";
        } else if (currentInput.toLowerCase().includes("report")) {
          testResponse = "I can generate various medical reports for you. Available report types include:\n\n• Patient summary reports\n• Appointment summaries\n• Billing reports\n• Medical history reports\n• Prescription reports\n• Lab result reports\n\nPlease specify which type of report you need and the date range. I can generate and format the report for you to download or share.";
        } else if (currentInput.toLowerCase().includes("reminder")) {
          testResponse = "I'll help you send WhatsApp reminders to patients. I can send reminders for:\n\n• Upcoming appointments\n• Medication reminders\n• Follow-up visits\n• Test results\n• Payment due dates\n\nPlease provide the patient's phone number and the message content you'd like to send. I'll format it professionally and send it via WhatsApp.";
        } else {
          testResponse = "I'm here to help you with healthcare management tasks. You can ask me about:\n\n• Creating patient records\n• Scheduling appointments\n• Generating reports\n• Sending WhatsApp reminders\n• Analyzing uploaded files\n\nWhat specific task would you like assistance with?";
        }

        // Add a placeholder message for streaming
        const streamingMessageId = "streaming-" + Date.now();
        const placeholderMessage: Message = {
          id: streamingMessageId,
          text: "",
          sender: "doku",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, placeholderMessage]);
        
        // Start streaming the response
        await simulateStreamingResponse(testResponse, (streamingText) => {
          setStreamingMessage(streamingText);
          setMessages((prevMessages) => 
            prevMessages.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, text: streamingText }
                : msg
            )
          );
        });
        
      } catch (error) {
        console.log(error);
        const errorMessage: Message = {
          id: new Date().toISOString(),
          text: "Sorry, I encountered an error. Please try again.",
          sender: "doku",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  const MessageBubble = ({ msg }: { msg: Message }) => {
    const isCurrentStreaming = isStreaming && msg.sender === "doku" && msg.id.startsWith("streaming-");
    
    return (
      <div
        className={`flex flex-col mb-6 ${
          msg.sender === "user" ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`prose dark:prose-invert rounded-2xl px-6 py-4 max-w-3xl shadow-lg ${
            msg.sender === "user"
              ? "bg-primary text-white rounded-br-none"
              : "bg-white dark:bg-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700"
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
          {isCurrentStreaming && (
            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"></span>
          )}
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
  };

  return (
    <div 
      className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${isDragOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border-2 border-dashed border-blue-500">
            <div className="text-center">
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Drop files here
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload images (JPEG, PNG, GIF, WebP) or PDF files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && !isThinking ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Hello! I am Doku, your AI assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                I can help you with creating patients, appointments, reports, and sending WhatsApp reminders. How can I help you today?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => setInputValue("Create a new patient record")}
                  className="p-4 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Create Patient
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add a new patient to the system
                  </p>
                </button>
                <button
                  onClick={() => setInputValue("Schedule an appointment")}
                  className="p-4 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Book Appointment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Schedule a new appointment
                  </p>
                </button>
                <button
                  onClick={() => setInputValue("Generate a medical report")}
                  className="p-4 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Create Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate medical reports
                  </p>
                </button>
                <button
                  onClick={() => setInputValue("Send WhatsApp reminder")}
                  className="p-4 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Send Reminder
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send WhatsApp reminders to patients
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isThinking && (
                <div className="flex flex-col mb-6 items-start">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-6 py-4 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-600 rounded-md border border-gray-200 dark:border-gray-500"
                  >
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') ? (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-32">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full transition-colors"
                    >
                      <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Ask me about patients, appointments, reports, or reminders..."
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3 sm:py-4 pl-4 sm:pl-6 pr-28 sm:pr-36 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
              {/* File Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 sm:p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                title="Upload files (Images & PDFs)"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>
                </svg>
              </button>
              
              {/* Voice Input Button */}
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
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  listening
                    ? "bg-red-500 text-white scale-110"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
                title="Voice input"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
                  <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
                </svg>
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && uploadedFiles.length === 0}
                className="p-1.5 sm:p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition-all"
                title="Send message"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line • Ask about healthcare tasks</span>
            <span className="sm:hidden">Press Enter to send • Healthcare AI</span>
            {listening && (
              <span className="flex items-center gap-1 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Listening...</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
