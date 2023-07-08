import React from "react";
import styles from "@/app/dashboard/social/chat-search/chatSearch.module.css";
import { Header } from "@/app/dashboard/social/(layout)/socialComponent";
import {
  SearchBar,
  ListUser,
} from "@/app/dashboard/social/chat-search/chatSearchComponent";

interface ChatSearchProps {}

const ChatSearch: React.FC<ChatSearchProps> = ({}) => {
  return (
    <div className={styles.container}>
      <Header text="Send new message" />
      <div className={styles.mainFrame}>
        <SearchBar />
        <ListUser />
      </div>
    </div>
  );
};

export default ChatSearch;
