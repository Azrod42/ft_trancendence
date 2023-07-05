"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { getAllUsers, getUserInfo } from "@/app/auth/auth.api";
import styles from "@/app/dashboard/social/chat-search/chatSearch.module.css";
import Image from "next/image";

export const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchBar}>
      <Image src="/media/search.png" alt="icon" width={24} height={24} />
      <input type="search" placeholder="Search people" />
    </div>
  );
};

interface SearchUserProps {
  user: any;
  onClick: (userId: string) => void;
}

export const SearchUser: React.FC<SearchUserProps> = ({ user, onClick }) => {
  return (
    <div className={styles.user} key={user.id} onClick={() => onClick(user.id)}>
      <Image
        src="/media/default-img-profile.png"
        alt="Profile"
        width={48}
        height={48}
        className={styles.profileImage}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{user.displayname}</span>
        <span className={styles.userExp}>{user.elo} XP</span>
        <span className={styles.userLevel}>Level 1</span>
      </div>
    </div>
  );
};

interface ListUserProps {}

export const ListUser: React.FC<ListUserProps> = ({}) => {
  let [allUserData, setAllUserData] = useState<any[]>([]);
  let [currentUserData, setCurrentUserData] = useState<any>();
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const { push } = useRouter();

  const { data: users, refetch: refetchAllUsers } = useQuery(
    "getUserInfo",
    () =>
      getAllUsers().then((res) => {
        setAllUserData(res?.data);
      }),
    { staleTime: 1000 * 60 * 2 }
  );

  const { data: currentUser, refetch: refetchUserInfo } = useQuery(
    "getUserInfo",
    () =>
      getUserInfo().then((res) => {
        if (res == undefined) push("/");
        setCurrentUserData(res);
      }),
    { staleTime: 5000 }
  );

  useEffect(() => {
    if (users) {
      setAllUserData((prevUsers) => [...prevUsers, ...users]);
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserData(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (allUserData.length === 0) {
      refetchAllUsers();
    }
    if (!currentUserData) {
      refetchUserInfo();
    }
  }, [allUserData, currentUserData, refetchAllUsers, refetchUserInfo]);

  const handleUserClick = (userId: string) => {
    push(`/dashboard/social/chat/chat-message/${userId}`);
  };

  return (
    <>
      {allUserData && currentUserData && allUserData.length > 0 && (
        <div className={styles.userList}>
          {allUserData
            .filter((user: any) => user.id !== currentUserData.id)
            .map((user: any) => (
              <SearchUser key={user.id} user={user} onClick={handleUserClick} />
            ))}
        </div>
      )}
    </>
  );
};
