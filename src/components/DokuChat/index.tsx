"use client";
import React, { useState } from "react";
import FloatingButton from "@/components/DokuChat/FloatingButton";
import ChatWindow from "@/components/DokuChat/ChatWindow";

const Doku = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatWindow isOpen={isOpen} toggleChat={toggleChat} />
      <FloatingButton toggleChat={toggleChat} />
    </>
  );
};

export default Doku;
