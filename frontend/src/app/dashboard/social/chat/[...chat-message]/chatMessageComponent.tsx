import React from "react";
import styles from "./chatMessage.module.css";
import Image from "next/image";

interface ChatWindowProps {}

export const ChatWindow: React.FC<ChatWindowProps> = () => {
  return (
    <div className={styles.containerMessage}>
      <SubmitMessage />
    </div>
  );
};

interface SubmitMessageProps {}

const SubmitMessage: React.FC<SubmitMessageProps> = () => {
  return (
    <form className={styles.searchBar} action="">
      <input
        className={styles.input}
        id="m"
        placeholder="Enter your message…"
        autoComplete="off"
        required
      />
      <button className={styles.button}>
        {<Image src="/media/send.png" width={24} height={24} alt="Send" />}
      </button>
    </form>
  );
};

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = () => {
  return (
    <>
      <div className={styles.profile}></div>
    </>
  );
};
