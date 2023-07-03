import React from "react";
import { ChatWindow } from "./chatMessageComponent";
import styles from "./chatMessage.module.css";

interface ChatMessageProps {}

const ChatMessage: React.FC<ChatMessageProps> = () => {
  return (
    <div>
      <ChatWindow />
    </div>
  );
};

export default ChatMessage;
