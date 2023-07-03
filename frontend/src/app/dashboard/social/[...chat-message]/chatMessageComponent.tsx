import React from "react";
import styles from "./chatMessage.module.css";

interface ChatWindowProps {}

export const ChatWindow: React.FC<ChatWindowProps> = () => {
  return (
    <>
      <div className={styles.containerMessage}></div>
    </>
  );
};
