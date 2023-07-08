"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import styles from "./chatHome.module.css";
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";
import "../channel-create/style.css";
import Image from "next/image";
import { getBlockList, getChatList, getFriendList } from "@/app/auth/auth.api";

interface CategoryProps {
  title: string;
  count: number;
  type: string;
  users?: any[];
}

export const Category: React.FC<CategoryProps> = ({
  title,
  count,
  type,
  users,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();

  const handleUserClick = (userId: string) => {
    if (type === "blockedDiv") {
      push(`/dashboard/user/${userId}`);
    } else {
      push(`/dashboard/social/chat/chat-message/${userId}`);
    }
  };

  useEffect(() => {
    const Elem = document.getElementById(type);
    if (isOpen == false) {
      Elem?.classList.add("hide");
    } else {
      Elem?.classList.remove("hide");
    }
  }, [isOpen, type]);

  return (
    <>
      <div className={styles.category} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.name}>
          <p>{title}</p>
          <p id={type + "nu"}></p>
        </div>
        <Image
          className={styles.arrow}
          src="/media/arrow.png"
          width={13}
          height={7}
          alt="arrow"
          style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
      </div>
      <div id={type} className={styles.channelUnit}>
        {isOpen && (
          <div>
            {users &&
              users.map((user: any) => (
                <div
                  className={styles.userCategory}
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                >
                  <Image
                    src="/media/default-img-profile.png"
                    alt="Profile"
                    width={36}
                    height={36}
                  />
                  <p key={user.id + "un"}>{user.displayname}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export const ChatCategory: React.FC = () => {
  const { push } = useRouter();

  const [userFriend, setUserFriend] = useState<any>();
  const [userOther, setUserOther] = useState<any>();
  const [userBlocked, setUserBlocked] = useState<any>();

  useEffect(() => {
    getFriendList().then((res) => {
      setUserFriend(res?.data);
    });
    getChatList().then((res) => {
      setUserOther(res?.data);
    });
    getBlockList().then((res) => {
      setUserBlocked(res?.data);
    });
  }, []);

  const {
    isLoading: friendLoading,
    error: friendError,
    data: friendData,
    refetch: refetchFriendList,
  } = useQuery(
    "getUserFriend",
    () =>
      getFriendList().then((res) => {
        if (res && res.data) {
          const dta = JSON.parse(JSON.stringify(res.data));
          setUserFriend(res.data);
        }
      }),
    { staleTime: 5000, refetchInterval: 1000 * 5, refetchOnWindowFocus: false }
  );

  const {
    isLoading: otherLoading,
    error: otherError,
    data: otherData,
    refetch: refetchOtherList,
  } = useQuery(
    "getUserOther",
    () =>
      getChatList().then((res) => {
        if (res && res.data) {
          const dta = JSON.parse(JSON.stringify(res.data));
          setUserOther(res.data);
        }
      }),
    { staleTime: 5000, refetchInterval: 1000 * 5, refetchOnWindowFocus: false }
  );

  const {
    isLoading: blockedLoading,
    error: blockedError,
    data: blockedData,
    refetch: refetchBlockedList,
  } = useQuery(
    "getUserBlocked",
    () =>
      getBlockList().then((res) => {
        if (res && res.data) {
          const dta = JSON.parse(JSON.stringify(res.data));
          setUserBlocked(res.data);
        }
      }),
    { staleTime: 5000, refetchInterval: 1000 * 5, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    getFriendList();
    refetchOtherList();
    refetchBlockedList();
  }, [refetchFriendList, refetchOtherList, refetchBlockedList]);

  return (
    <div className={styles.container}>
      <Category
        title="My friends"
        count={userFriend?.length ?? 0}
        type={"friendDiv"}
        users={userFriend || []}
      />
      <Category
        title="Others"
        count={userOther?.length ?? 0}
        type={"othersDiv"}
        users={userOther || []}
      />
      <Category
        title="Blocked"
        count={userBlocked?.length ?? 0}
        type={"blockedDiv"}
        users={userBlocked || []}
      />
    </div>
  );
};

interface ButtonsProps {
  firstButtonText: string;
  firstButtonUrl: string;
  secondButtonText: string;
  secondButtonUrl: string;
}

export const HomeButtons: React.FC<ButtonsProps> = ({
  firstButtonText,
  firstButtonUrl,
  secondButtonText,
  secondButtonUrl,
}) => {
  const { push } = useRouter();

  const handleFirstButton = () => {
    push(firstButtonUrl);
  };

  const handleSecondButton = () => {
    push(secondButtonUrl);
  };

  return (
    <div className={styles.buttonsContainer}>
      <button className={styles.firstButton} onClick={handleFirstButton}>
        {firstButtonText}
      </button>
      <div className={styles.separator}>or</div>
      <button className={styles.secondButton} onClick={handleSecondButton}>
        {secondButtonText}
      </button>
    </div>
  );
};
