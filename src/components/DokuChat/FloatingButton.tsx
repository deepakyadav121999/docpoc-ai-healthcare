import React from "react";

const FloatingButton = ({ toggleChat }: { toggleChat: () => void }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-[65px] right-4 md:bottom-[57px] md:right-8 z-[9999] w-16 h-16 rounded-full bg-primary-soft shadow-soft-xl dark:shadow-dark-soft-xl flex items-center justify-center group"
      aria-label="Toggle Chat"
    >
      <div className="relative w-8 h-8">
        {/* Eyes */}
        <span className="absolute top-1/3 left-[18%] w-1.5 h-1.5 bg-white rounded-full transition-all duration-300 ease-in-out group-hover:scale-110"></span>
        <span className="absolute top-1/3 right-[18%] w-1.5 h-1.5 bg-white rounded-full transition-all duration-300 ease-in-out group-hover:scale-110"></span>
        {/* Mouth */}
        <span
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full transition-opacity duration-300 ease-in-out group-hover:opacity-0"
          aria-hidden="true"
        ></span>
        <span
          className="absolute bottom-[13%] left-1/2 -translate-x-1/2 w-5 h-2 border-b-2 border-white rounded-b-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
          aria-hidden="true"
        ></span>
        {/* Pulse animation */}
        <span className="absolute inset-0 w-full h-full rounded-full bg-primary-soft/50 animate-pulse group-hover:animate-none"></span>
      </div>
    </button>
  );
};

export default FloatingButton;
