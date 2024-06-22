import React, { useState } from "react";

const ChatbotContext = React.createContext();

const ChatbotProvider = ({ children }) => {
  const [chatbot, setChatbot] = useState("gemini");

  return (
    <ChatbotContext.Provider value={{ chatbot, setChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext, ChatbotProvider };
