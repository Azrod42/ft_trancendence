"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "./chatMessage.module.css";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getPublicUserInfo, getUserInfo, setSlot } from "@/app/auth/auth.api";
import {
  addFriend,
  removeFriend,
  addBlock,
  removeBlock,
} from "@/app/auth/auth.api";
import {
  FormValueUserSendMessage,
  sendUserMessageApi,
  getUserMessageApi,
} from "@/app/dashboard/social/social.api";
import { WebsocketContext } from "@/app/(common)/WebsocketContext";
import { useQuery } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";
import { getWebSocketIdByUserId } from "@/app/auth/auth.api";
import uuid from "react-uuid";
import { setGameNumber } from "@/app/auth/auth.api";

interface ChatWindowProps {}

export const ChatWindow: React.FC<ChatWindowProps> = ({}) => {
  const [user1Id, setUser1Id] = useState<string>("");
  const user2Id: string = useParams()["chat-message"][1];
  const [roomID, setRoomID] = useState<string>("");
  const [createRoom, setCreateRoom] = useState<boolean>(false);

  const [message, setMessage] = useState("");
  const [socket] = useState(useContext(WebsocketContext));
  const [userData, setUserData] = useState<any>();
  const [msgUserData, setMsgUserData] = useState<any>();
  const htmlMsgInput: React.MutableRefObject<any> = useRef();
  const sendMsg = useForm<FormValueUserSendMessage>();
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [errorDisplay, setError] = useState<boolean>(false);
  const [headerError, setHeaderError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    getUserInfo().then((res) => {
      if (res && res.id) {
        setUser1Id(res.id);
        for (let i = 0; user1Id[i]; i++) {
          if (user1Id[i] > user2Id[i]) {
            setRoomID(user1Id + user2Id);
            return;
          } else {
            setRoomID(user2Id + user1Id);
            return;
          }
        }
      }
    });
  }, [userData]);

  useEffect(() => {
    if (createRoom == false) setCreateRoom(true);
  }, [roomID]);

  useEffect(() => {
    setCurrentUserId(user2Id);
  }, [user2Id]);

  const userQuery = useQuery(
    "fetchUserChatData",
    () =>
      getUserInfo().then((res) => {
        setUserData(res);
      }),
    { staleTime: 5000, refetchOnWindowFocus: false }
  );
  const messageUserQuery = useQuery(
    "fetchMsgUserData",
    () =>
      getUserMessageApi({ id: user2Id }).then((res) => {
        if (res?.status == true) setMsgUserData(res.data);
      }),
    { staleTime: 1000, refetchOnWindowFocus: false }
  );

  // useEffect(() => {
  //   if (currentUserId) {
  //     messageUserQuery.refetch();
  //   }
  // }, [currentUserId, messageUserQuery]);

  useEffect(() => {
    if (msgUserData) {
      let html: string = `

           <style>
                .containerMsg {
                   display: flex;
                   flex-direction: column;
                   justify-content: flex-start;
                   align-items: flex-start;
                   gap: 0;
                   margin: 0;
                   margin-top: 20px;
                   margin-left: 10px;
                }
                .msgHeader {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;

                }
                .message {
                    align-self: flex-start;
                    margin: 0;
                }
                .message1 {
                    align-self: flex-start;
                    margin: 0;
                    color: deepskyblue;
                    font-weight: 700;
                }
                .message2 {
                    align-self: flex-start;
                    margin: 0;
                    color: whitesmoke;
                    font-size: 0.8rem;
                }
           </style>
        `;
      for (let i = 0; msgUserData[i]; i++) {
        const date = new Date(msgUserData[i].time);
        const time = `${date.getDay()} / ${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
        html += `
            <div class="containerMsg">
                <div class='msgHeader'>
                    <p class='message1' >${msgUserData[i].displaynameSender}</p>
                    <p class='message2'>${time}</p>
                </div>
                <p class='message'>${msgUserData[i].message}</p>
            </div>
            `;
      }

      const chatWindow = htmlMsgInput.current;
      const shouldScrollToBottom =
        chatWindow.scrollTop + chatWindow.clientHeight ===
        chatWindow.scrollHeight;

      htmlMsgInput.current.innerHTML = html;
      htmlMsgInput.current.scrollTop = htmlMsgInput.current.scrollHeight;
    }
  }, [msgUserData]);

  useEffect(() => {
    if (roomID != "") {
      socket.emit(`room`, `${roomID}`);
      socket.on(`${roomID}`, (data) => {
        setTimeout(() => {
          messageUserQuery.refetch();
        }, 100);
      });
      return () => {
        socket.off(`${roomID}`);
      };
    }
  }, [roomID]);

  const onSubmitSendMessage: SubmitHandler<FormValueUserSendMessage> = (
    data
  ) => {
    data.idSender = user1Id;
    data.idTarget = user2Id;
    data.time = new Date().getTime();
    if (userData && userData.displayname) {
      data.displaynameSender = userData.displayname;
    }
    const allMessages = message;
    data.message += "\n" + allMessages;

    sendUserMessageApi(data).then((res) => {
      if (res?.status == false) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        socket.emit(`channelMessage`, { channel: roomID, message: true });
      }
    });
    sendMsg.reset();
  };

  return (
    <div className={styles.containerMessage}>
      {errorDisplay ? (
        <ErrorNotification headerText={headerError} error={errorMsg} />
      ) : (
        <></>
      )}
      <div className={styles.chatWindow} ref={htmlMsgInput}>
        <LoadingPage />
      </div>
      <form
        className={styles.searchBar}
        onSubmit={sendMsg.handleSubmit(onSubmitSendMessage)}
      >
        <input
          className={styles.input}
          type="text"
          placeholder=""
          {...sendMsg.register("message", { required: true })}
        />
        <button type="submit" value="send">
          <Image
            className={styles.button}
            src="/media/send.png"
            width={24}
            height={24}
            alt="Send"
          />
        </button>
      </form>
    </div>
  );
};

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = () => {
  const userId: string = usePathname().split("/").pop()!;

  const [userData, setUserData] = useState<any>();
  const [userPublicData, setUserPublicData] = useState<any>();
  const [xp, setXp] = useState<number>(0);

  const [error, setError] = useState<boolean>(false);
  const [headerError, setHeaderError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const publicQuery = useQuery(
    "getUserInfo",
    () =>
      getPublicUserInfo(userId).then((res) => {
        if (res && res.data) {
          setUserPublicData(res.data);
          setIsLoading(false);
        }
      }),
    { refetchInterval: 4000, refetchOnWindowFocus: false }
  );

  function onClickAddFriend() {
    const dtoId = { id: userId };
    addFriend(dtoId).then((res) => {
      if (!res?.data) {
        setHeaderError("Error:");
        setErrorMsg("Failed to add friend");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      } else {
        //console.log(res);
      }
    });
  }

  function onClickRemoveFriend() {
    const dtoId = { id: userId };
    removeFriend(dtoId).then((res) => {
      if (!res?.data) {
        setHeaderError("Error:");
        setErrorMsg("Failed to remove friend");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      } else {
        //console.log(res);
      }
    });
  }

  function onClickAddBlock() {
    const dtoId = { id: userId };
    addBlock(dtoId).then((res) => {
      if (!res?.data) {
        setHeaderError("Error:");
        setErrorMsg("Failed to add block");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      } else {
        //console.log(res);
        push(`/dashboard/social/chat-home`);
      }
    });
  }

  function onClickRemoveBlock() {
    const dtoId = { id: userId };
    removeBlock(dtoId).then((res) => {
      if (!res?.data) {
        setHeaderError("Error:");
        setErrorMsg("Failed to remove block");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      } else {
        //console.log(res);
      }
    });
  }

  function onClickProfile() {
    push(`/dashboard/user/${userId}`);
  }

  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) {
        setUserData(data);
      }
    });
  }, []);

  const { push, refresh } = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [socket] = useState(useContext(WebsocketContext));

  const handleFightClick = (id: string) => {
    setSlot({ id: 1 }).then((res) => {});
    setGameNumber(1).then((res) => {});
    getWebSocketIdByUserId(id).then((res) => {
      const uid = uuid();
      socket.emit("duelRequest", {
        socketId: res?.data,
        idRoom: uid,
        p2ID: id,
        p1ID: userData?.id,
        currentUserName: currentUserName,
      });
      setGameNumber(1).then((res) => {});
      setGameNumber(1).then((res) => {});
      push(`/dashboard/game/${uid}1`);
    });
  };

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className={styles.profile}>
          <div>
            <h2 className={styles.heading}>Profile</h2>
            <p className={styles.name}>{userPublicData?.displayname}</p>
            <p className={styles.exp}>Exp: {userPublicData?.xp}</p>
            <div className={styles.chatWith} onClick={onClickProfile}>
              <span>See all profile</span>
            </div>
            <div
              className={styles.chatWith}
              onClick={() => handleFightClick(userId)}
            >
              <span>PLAY</span>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            {error && (
              <ErrorNotification headerText={headerError} error={errorMsg} />
            )}
            <div className={styles.chatWith} onClick={onClickAddFriend}>
              <span>Add friend</span>
            </div>
            <div
              className={styles.removeChatWith}
              onClick={onClickRemoveFriend}
            >
              <span>Remove-friend</span>
            </div>
            <div className={styles.chatWith} onClick={onClickAddBlock}>
              <span>Block user</span>
            </div>
            <div className={styles.removeChatWith} onClick={onClickRemoveBlock}>
              <span>Remove-block</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
