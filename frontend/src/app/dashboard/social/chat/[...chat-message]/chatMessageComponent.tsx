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
  FormValueSendMessage,
  sendMessageApi,
} from "@/app/dashboard/social/social.api";
import { WebsocketContext } from "@/app/(common)/WebsocketContext";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";

interface ChatWindowProps {}

export const ChatWindow: React.FC<ChatWindowProps> = () => {
  const [user1Id, setUser1Id] = useState<string>("");
  const user2Id: string = usePathname().split("/").pop()!;
  const roomId = `private_${user1Id}_${user2Id}`;

  const [messages, setMessages] = useState<string[]>([]);
  const [socket] = useState(useContext(WebsocketContext));
  const [userData, setUserData] = useState<any>();
  const [msgData, setMsgData] = useState<any>();
  const htmlMsgInput: React.MutableRefObject<any> = useRef();

  const [message, setMessage] = useState("");
  const sendMsg = useForm<FormValueSendMessage>();

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

  useEffect(() => {
    const roomId = `private_${user1Id}_${user2Id}`;

    socket.emit("room", roomId);

    socket.on(roomId, (data) => {});

    return () => {
      socket.off(roomId);
    };
  }, [socket, user1Id, user2Id]);

  useEffect(() => {
    if (msgData) {
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
      for (let i = 0; msgData[i]; i++) {
        const date = new Date(msgData[i].time);
        const time = `${date.getDay()} / ${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
        html += `
            <div class="containerMsg">
                <div class='msgHeader'>
                    <p class='message1' >${msgData[i].displayname}</p>
                    <p class='message2'>${time}</p>
                </div>
                <p class='message'>${msgData[i].message}</p>
            </div>
            `;
      }
      htmlMsgInput.current.innerHTML = html;
      htmlMsgInput.current.scrollTop = htmlMsgInput.current.scrollHeight;
    }
  }, [msgData]);

  const onSubmitSendMessage: SubmitHandler<FormValueSendMessage> = (data) => {
    data.chanId = roomId;
    data.time = new Date().getTime();
    data.displayname = userData?.displayname ?? "";
    data.id = userData.id;
    sendMessageApi(data).then((res) => {
      if (res?.status == false) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        socket.emit(`channelMessage`, {
          channel: `${roomId}`,
          message: data.message,
        });
      }
    });
    sendMsg.reset();
  };

  return (
    <div className={styles.containerMessage}>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      {errorDisplay ? (
        <ErrorNotification headerText={headerError} error={errorMsg} />
      ) : (
        <></>
      )}
      <form
        className={styles.searchBar}
        onSubmit={sendMsg.handleSubmit(onSubmitSendMessage)}
      >
        <input
          className={styles.input}
          placeholder="Enter your message…"
          type="text"
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
