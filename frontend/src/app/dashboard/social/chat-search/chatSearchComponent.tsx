"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import {
  getAllUsers,
  getUserInfo,
  UserAuthResponse,
} from "@/app/auth/auth.api";
import styles from "@/app/dashboard/social/chat-search/chatSearch.module.css";
import Image from "next/image";
import { addChat } from "@/app/auth/auth.api";
import { getBlockList } from "@/app/auth/auth.api";
import { useBlocker } from "react-router/dist/lib/hooks";
import { postUserStats } from "@/app/dashboard/social/social.api";

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
  const [xp, setXp] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  let [userData, setuserData] = useState<UserAuthResponse>();
  const { push } = useRouter();
  const { refetch } = useQuery(
    "getUserInfo",
    () =>
      getUserInfo().then((res) => {
        if (res == undefined) push("/");
        setuserData(res);
      }),
    { staleTime: 5000 }
  );
  useEffect(() => {
    if (userData == undefined) {
      refetch();
    }
  });
  useEffect(() => {
    setLoading(false);
  }, [userData]);

  useEffect(() => {
    if (userData?.id) {
      postUserStats({ id: userData?.id! }).then((res: any) => {
        setXp(res?.data?.xp);
      });
    }
  }, [userData]);

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
        <span className={styles.userExp}>{user.xp} XP</span>
        <span className={styles.userLevel}>
          Level {Math.floor(Math.sqrt(user.xp / 100) + 1)}
        </span>
      </div>
    </div>
  );
};

interface ListUserProps {}

export const ListUser: React.FC<ListUserProps> = ({}) => {
  const { push } = useRouter();
  const [allUserData, setAllUserData] = useState<any[]>([]);
  const [currentUserData, setCurrentUserData] = useState<any>();
  const [userBlocked, setUserBlocked] = useState<any[]>(
    currentUserData?.blocked || []
  );
  const [blockedDataInitialized, setBlockedDataInitialized] =
    useState<boolean>(false);

  const { data: users, refetch: refetchAllUsers } = useQuery<any>(
    "getallUser",
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
      setAllUserData(users?.data);
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserData(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUserData) {
      setUserBlocked(currentUserData?.blocked || []);
    }
  }, [currentUserData]);

  useEffect(() => {
    if (!allUserData || allUserData.length === 0) {
      refetchAllUsers();
    }
    if (!currentUserData) {
      refetchUserInfo();
    }
  }, [allUserData, currentUserData, refetchAllUsers, refetchUserInfo]);

  const handleUserClick = (userId: string) => {
    const dtoId = { id: userId };
    addChat(dtoId).then((res) => {});
    push(`/dashboard/social/chat/chat-message/${userId}`);
  };

  return (
    <>
      {allUserData && currentUserData && allUserData.length > 0 && (
        <div className={styles.userList}>
          {allUserData
            .filter((user: any) => {
              const blockedUsers = currentUserData?.blocked
                ? JSON.parse(currentUserData.blocked)
                : [];
              const isBlocked = blockedUsers.some(
                (blockedUser: any) => blockedUser.id === user.id
              );
              return user.id !== currentUserData.id && !isBlocked;
            })
            .map((user: any) => (
              <SearchUser key={user.id} user={user} onClick={handleUserClick} />
            ))}
        </div>
      )}
    </>
  );
};
