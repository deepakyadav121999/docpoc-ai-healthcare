"use client";
import React, { useEffect, useState } from "react";

export const CreditCardBouncing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const darkModeObserver = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark"));
    });

    darkModeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    setIsDarkMode(root.classList.contains("dark"));

    return () => darkModeObserver.disconnect();
  }, []);

  // const toggleMode = () => {
  //   const root = window.document.documentElement;
  //   if (root.classList.contains("dark")) {
  //     root.classList.remove("dark");
  //   } else {
  //     root.classList.add("dark");
  //   }
  // };

  return (
    <div className={`flex flex-col items-center justify-center  `}>
      <div
        className={`relative w-72 h-44 rounded-lg overflow-hidden transform-gpu animate-bounce ${isDarkMode ? "bg-gray-700 shadow-lg shadow-gray-900" : "bg-cyan-100 shadow-lg shadow-gray-300"}`}
      >
        <div
          className={`absolute top-12 left-8 w-12 h-8 rounded-sm ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`}
        ></div>
        <div
          className={`absolute bottom-5 right-5 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isDarkMode ? "bg-gray-600 text-gray-200" : "bg-gray-300 text-gray-800"}`}
        >
          VISA
        </div>
        <div className="absolute bottom-12 left-8 text-lg tracking-widest">
          **** **** **** 1234
        </div>
      </div>
    </div>
  );
};

export default CreditCardBouncing;
