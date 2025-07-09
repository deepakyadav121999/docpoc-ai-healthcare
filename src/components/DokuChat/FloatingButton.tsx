import React from "react";

const FloatingButton = ({ toggleChat }: { toggleChat: () => void }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-8 right-8 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-[9999]"
      aria-label="Toggle Chat"
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        ></path>
      </svg>
    </button>
  );
};

export default FloatingButton; 