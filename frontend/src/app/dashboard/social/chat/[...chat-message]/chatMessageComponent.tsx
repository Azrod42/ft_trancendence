"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "./chatMessage.module.css";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getPublicUserInfo, getUserInfo } from "@/app/auth/auth.api";
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

interface ChatWindowProps {}

export const ChatWindow: React.FC<ChatWindowProps> = ({}) => {
  const [user1Id, setUser1Id] = useState<string>("");
  const user2Id: string = usePathname().split("/").pop()!;
  const [message, setMessage] = useState("");
  const [socket] = useState(useContext(WebsocketContext));
  const [userData, setUserData] = useState<any>();
  const [msgUserData, setMsgUserData] = useState<any>();
  const htmlMsgInput: React.MutableRefObject<any> = useRef();
  const sendMsg = useForm<FormValueUserSendMessage>();

  const [errorDisplay, setError] = useState<boolean>(false);
  const [headerError, setHeaderError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    getUserInfo().then((res) => {
      if (res && res.id) {
        setUser1Id(res.id);
      }
    });
  }, []);

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
    { staleTime: 500, refetchOnWindowFocus: false }
  );

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
                   /*border: 1px solid red;*/
                   margin: 0;
                   margin-top: 20px;
                   margin-left: 10px;
                }
                .msgHeader {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    /*border: 1px solid greenyellow;*/

                }
                .message {
                    /*border: 1px solid pink;*/
                    align-self: flex-start;
                    margin: 0;
                }
                .message1 {
                    /*border: 1px solid pink;*/
                    align-self: flex-start;
                    margin: 0;
                    color: deepskyblue;
                    font-weight: 700;
                }
                .message2 {
                    /*border: 1px solid pink;*/
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
      htmlMsgInput.current.innerHTML = html;
      htmlMsgInput.current.scrollTop = htmlMsgInput.current.scrollHeight;
    }
  }, [msgUserData]);

  useEffect(() => {
    socket.emit(`room`, `${user2Id}`);
    socket.on(`${user2Id}`, (data) => {
      // console.log(data);
      messageUserQuery.refetch();
    });
    return () => {
      socket.off(`${user2Id}`);
    };
  }, [messageUserQuery, socket, user2Id]);

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
        socket.emit(`newMessage`, {
          userId: user2Id,
          message: data.message,
        });
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
  const { push } = useRouter();
  const userId: string = usePathname().split("/").pop()!;

  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    getPublicUserInfo(userId).then((res) => {
      if (res && res.data) {
        setUserData(res.data);
      }
    });
  }, [userId]);

  function onClickAddFriend() {
    const dtoId = { id: userId };
    addFriend(dtoId).then((res) => {
      console.log(res);
    });
  }

  function onClickRemoveFriend() {
    const dtoId = { id: userId };
    removeFriend(dtoId).then((res) => {
      console.log(res);
    });
  }

  function onClickAddBlock() {
    const dtoId = { id: userId };
    addBlock(dtoId).then((res) => {
      console.log(res);
    });
  }

  function onClickRemoveBlock() {
    const dtoId = { id: userId };
    removeBlock(dtoId).then((res) => {
      console.log(res);
    });
  }

  function onClickProfile() {
    push(`/dashboard/user/${userId}`);
  }

  return (
    <>
      <div className={styles.profile}>
        <div>
          <h2 className={styles.heading}>Profile</h2>
          <p className={styles.name}>{userData?.displayname}</p>
          <p className={styles.exp}>Exp: {userData?.elo}</p>
          <div className={styles.chatWith} onClick={onClickProfile}>
            <span>See all profile</span>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.chatWith} onClick={onClickAddFriend}>
            <span>Add friend</span>
          </div>
          <div className={styles.removeChatWith} onClick={onClickRemoveFriend}>
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
    </>
  );
};
