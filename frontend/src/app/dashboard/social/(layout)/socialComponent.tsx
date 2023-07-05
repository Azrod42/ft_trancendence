"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./SocialLayout.module.css";
import Image from "next/image";

interface DashboardProps {
  children: React.ReactNode;
}

interface HeaderProps {
  text: string;
}

export const Header: React.FC<HeaderProps> = ({ text }) => {
  return (
    <div className={styles.staticTop}>
      <h1 className={styles.socialTitle}>{text}</h1>
    </div>
  );
};

export const ButtonGroup: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState("chat");

  useEffect(() => {
    const segment = pathname.split("/");
    let lastSection = segment.pop();
    if (lastSection) {
      if (lastSection.startsWith("chat") || lastSection.startsWith("channel")) {
        setActiveButton(lastSection.startsWith("chat") ? "chat" : "channel");
      } else {
        lastSection = segment.pop();
        if (lastSection) {
          setActiveButton(lastSection.startsWith("chat") ? "chat" : "channel");
        }
      }
    }
  }, [pathname]);

  const chatButton =
    activeButton === "chat"
      ? styles.buttonActiveChat
      : styles.buttonInactiveChat;
  const channelsButton =
    activeButton === "channel"
      ? styles.buttonActiveChannels
      : styles.buttonInactiveChannels;

  const handleButtonClick = (route: string) => {
    setActiveButton(route);
    router.push(`/dashboard/social/${route}-home`);
  };

  return (
    <div className={styles.buttonWrapper}>
      <div className={styles.buttonContainer}>
        <button
          className={chatButton}
          onClick={() => handleButtonClick("chat")}
        >
          <span className={styles.buttonText}>Chat</span>
        </button>
        <button
          className={channelsButton}
          onClick={() => handleButtonClick("channel")}
        >
          <span className={styles.buttonText}>Channels</span>
        </button>
      </div>
    </div>
  );
};

export const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchBar}>
      <Image src="/media/search.png" alt="icon" width={24} height={24} />
      <input type="search" placeholder="Search" />
    </div>
  );
};

export const TopBar: React.FC = () => {
  return (
    <div className={styles.staticTop}>
      <Header text="Social" />
      <ButtonGroup />
      <SearchBar />
    </div>
  );
};

export const Sidebar: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div className={styles.sidebar}>
      <TopBar />
      <div className={styles.contacts}>{children}</div>
    </div>
  );
};
