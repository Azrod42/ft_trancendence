import React from "react";
import { ChatWindow, Profile } from "./chatMessageComponent";
import styles from "./chatMessage.module.css";

interface ChatMessageProps {}

const ChatMessage: React.FC<ChatMessageProps> = () => {
  return (
    <div>
      <ChatWindow />
      <Profile />
    </div>
  );
};

export default ChatMessage;
