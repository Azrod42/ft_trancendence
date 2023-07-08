"use client";
import React, { useEffect } from "react";
import styles from "./chatHome.module.css";
import Layout from "@/app/dashboard/social/(layout)/SocialLayout";
import { HomeButtons } from "./chatHomeComponent";
import { useRouter } from "next/navigation";
import styles2 from "@/app/dashboard/social/chat-search/chatSearch.module.css";
import { Header } from "@/app/dashboard/social/(layout)/socialComponent";
import {
  SearchBar,
  ListUser,
} from "@/app/dashboard/social/chat-search/chatSearchComponent";

interface ChatHomeProps {}

const ChatHome: React.FC<ChatHomeProps> = ({}) => {
  const { prefetch } = useRouter();

  useEffect(() => {
    prefetch("/dashboard/social/channel-home");
  }, []);
  return (
    <>
      <div className={styles2.container}>
        <Header text="Send new message" />
        <div className={styles2.mainFrame}>
          <SearchBar />
          <ListUser />
        </div>
      </div>
    </>
  );
};

export default ChatHome;
