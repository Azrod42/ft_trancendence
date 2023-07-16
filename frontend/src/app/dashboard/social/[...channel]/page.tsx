"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./channelMessage.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FormValueJoinChannel,
  getPublicUserInfo,
  getUserInfo,
} from "@/app/auth/auth.api";
import {
  addAdministrator,
  banUserChan,
  blockUserApi,
  changeChanType,
  createChannel,
  fetchChannelInfo,
  FormChangeChanType,
  FormValueInviteUser,
  FormValueMuteUser,
  FormValueSendMessage,
  getChannelMessageApi,
  inviteUserChan,
  joinChannel,
  kickUserChan,
  leaveChannel,
  muteUserPost,
  removeAdministrator,
  sendMessageApi,
  unbanUserChan,
  unblockUserApi,
} from "@/app/dashboard/social/social.api";
import { useMutation, useQuery } from "react-query";
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";
import { mockSession } from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;
import { WebsocketContext } from "@/app/(common)/WebsocketContext";
import { getUserData } from "@/app/(common)/getUserData";

interface ChannelProps {}

const Channel: React.FC<ChannelProps> = ({}) => {
  const { push } = useRouter();
  let userRef: any = useRef(this);
  const uniqueIdentifier: string = useParams()["channel"][1];
  const [chanData, setChanData] = useState<any>(undefined);
  const [localConnectedUser, setLocalConnectedUser] = useState<any>(undefined);
  const [popup, setPopup] = useState<boolean>(false);
  const [displayPw, setDisplayPw] = useState<boolean>(false);
  const [displayBlockUser, setDisplayBlockUser] = useState<boolean>(false);
  const [changeTypeData, setChangeTypeData] = useState<FormChangeChanType>({
    id: "undefine",
    password: "undefine",
    type: 0,
  });
  const registerPw = useForm<FormValueJoinChannel>();
  const inviteUsr = useForm<FormValueInviteUser>();
  const sendMsg = useForm<FormValueSendMessage>();
  const kickUsr = useForm<FormValueInviteUser>();
  const banUsr = useForm<FormValueInviteUser>();
  const unbanUsr = useForm<FormValueInviteUser>();
  const addAdmin = useForm<FormValueInviteUser>();
  const removeAdmin = useForm<FormValueInviteUser>();
  const muteUser = useForm<FormValueMuteUser>();
  const blockUser = useForm<FormValueInviteUser>();
  const unblockUser = useForm<FormValueInviteUser>();

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //HANDLE ERROR NOTIFICATION
  const [errorDisplay, setError] = useState<boolean>(false);
  const [headerError, setHeaderError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //GET CHANNEL DATA
  const channelQuery = useQuery(
    "fetchChannelInfo",
    () =>
      fetchChannelInfo({ id: uniqueIdentifier }).then((res) => {
        setChanData(res.data);
      }),
    { staleTime: 5000, refetchOnWindowFocus: false, refetchInterval: 5000 }
  );

  setInterval(() => {
    if (localStorage.getItem("connectedUser")) {
      setLocalConnectedUser(JSON.parse(localStorage.getItem("connectedUser")!));
    }
  }, 5000);

  useEffect(() => {
    if (localStorage.getItem("connectedUser")) {
      setLocalConnectedUser(JSON.parse(localStorage.getItem("connectedUser")!));
    }
  }, []);

  useEffect(() => {
    if (!chanData) channelQuery.refetch();
    if (chanData) {
      if (chanData.channelusers == "") push("/dashboard/social/channel-home");
      const users = JSON.parse(chanData.channelusers);
      let i = -1;
      let userIn = false;
      while (users[++i]) {
        if (users[i].id == chanData.password) userIn = true;
      }
      if (!userIn) push("/dashboard/social/channel-home");
    }
    const userIds: any[] = [];
    if (chanData?.channelusers) {
      const userList = JSON.parse(chanData?.channelusers);
      let connectedUser: any[] = localConnectedUser;
      let htmlUser = `<style>
                                        .containerConnectedUserDiv {
                                            display: flex;
                                            flex-direction: column;
                                        }
                                        .containerConnectedUser {
                                            display: flex;
                                            flex-direction: row;
                                            gap: 7px;
                                        }
                                        .statusGreen {
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 10px;
                                            background-color: greenyellow;
                                            margin-top: 5px;
                                        }
                                        .statusRed {
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 10px;
                                            background-color: red;
                                            margin-top: 5px;
                                        }
                                    </style>`;
      for (let i = 0; userList[i]; i++) {
        getPublicUserInfo(userList[i].id).then((res: any) => {
          htmlUser += `<div class="containerConnectedUserDiv"><span class='containerConnectedUser' id='${res?.data.id}'>${res?.data.displayname}`;
          if (connectedUser) {
            let find = 0;
            for (let j = 0; connectedUser[j]; j++) {
              if (connectedUser[j].id == userList[i].id) {
                htmlUser += '<div class="statusGreen"></div>';
                find = 1;
              }
            }
            if (!find) {
              htmlUser += '<div class="statusRed"></div>';
            }
          }
          htmlUser += "</span></div>";
          if (userRef && userRef.current) userRef.current.innerHTML! = htmlUser;
          userIds.push({ id: res?.data.id });
        });
      }
      setTimeout(() => {
        for (let i = 0; i < userIds.length; i++) {
          let mySelectedElement = document.getElementById(userIds[i].id);
          mySelectedElement?.addEventListener("click", function getHtml() {
            push(`/dashboard/user/${userIds[i].id}`);
          });
        }
      }, 1000);
    } else channelQuery.refetch();
  }, [chanData]);
  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //MUTATION  CHANGE CHANNEL TYPE
  const { mutate: updateType } = useMutation(changeChanType, {
    onSuccess: (res: any) => {
      if (res.status == false) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
    },
  });
  const onSubmitChannelTypePw: SubmitHandler<FormValueJoinChannel> = (data) => {
    setDisplayPw(false);
    const newData: FormChangeChanType = changeTypeData;
    newData.password = data.password;
    updateType(newData);
  };
  function onSubmitChangeType(type: number) {
    setPopup(false);
    setChangeTypeData({ id: uniqueIdentifier, password: "unset", type: type });
    if (type == 3) setDisplayPw(true);
    else {
      const data: FormChangeChanType = {
        id: uniqueIdentifier,
        password: "unset",
        type: type,
      };
      updateType(data);
    }
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //INVITE USER IN CHANNEL
  const onSubmitInviteUsr: SubmitHandler<FormValueInviteUser> = (data) => {
    setPopup(false);
    data.chanId = uniqueIdentifier;
    inviteUserChan(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      inviteUsr.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //KICK USER IN CHANNEL
  const onSubmitKickUsr: SubmitHandler<FormValueInviteUser> = (data) => {
    setPopup(false);
    data.chanId = uniqueIdentifier;
    kickUserChan(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      kickUsr.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //BAN USER IN CHANNEL
  const onSubmitBanUsr: SubmitHandler<FormValueInviteUser> = (data) => {
    setPopup(false);
    data.chanId = uniqueIdentifier;
    banUserChan(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      banUsr.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //UNBAN USER IN CHANNEL
  const onSubmitUnbanUsr: SubmitHandler<FormValueInviteUser> = (data) => {
    setPopup(false);
    data.chanId = uniqueIdentifier;
    unbanUserChan(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      unbanUsr.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //UNBAN USER IN CHANNEL
  function onSubmitLeaveChannel() {
    leaveChannel({ id: uniqueIdentifier }).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
    });
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //ADD ADMIN USER IN CHANNEL
  const onSubmitAddAdmin: SubmitHandler<FormValueInviteUser> = (data) => {
    setPopup(false);
    data.chanId = uniqueIdentifier;
    addAdministrator(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      addAdmin.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //ADD ADMIN USER IN CHANNEL
  const onSubmitRemoveAdmin: SubmitHandler<FormValueInviteUser> = (data) => {
    setPopup(false);
    data.chanId = uniqueIdentifier;
    removeAdministrator(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      removeAdmin.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //ADD ADMIN USER IN CHANNEL
  const onSubmitMuteUser: SubmitHandler<FormValueMuteUser> = (data) => {
    setPopup(false);
    const date = new Date();
    data.time = date.getTime() + data.time * 1000;
    data.chanId = uniqueIdentifier;
    muteUserPost(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else channelQuery.refetch();
      muteUser.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //BLOCK USER
  function onSubmitBlockUser() {
    setDisplayBlockUser(true);
  }
  const onSubmitBlockUserForm: SubmitHandler<FormValueInviteUser> = (data) => {
    setDisplayBlockUser(false);
    data.chanId = uniqueIdentifier;
    blockUserApi(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        channelQuery.refetch();
        messageQuery.refetch();
      }
      removeAdmin.reset();
    });
  };
  const onSubmitUnBlockUserForm: SubmitHandler<FormValueInviteUser> = (
    data
  ) => {
    setDisplayBlockUser(false);
    data.chanId = uniqueIdentifier;
    unblockUserApi(data).then((res) => {
      if (!res.status) {
        setHeaderError("Error :");
        setErrorMsg(res.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        channelQuery.refetch();
        messageQuery.refetch();
      }
      removeAdmin.reset();
    });
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  const [socket] = useState(useContext(WebsocketContext));
  const [userData, setUserData] = useState<any>();
  const [msgData, setMsgData] = useState<any>();
  const htmlMsgInput: React.MutableRefObject<any> = useRef();

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //GET USER AND MSG HISTORY
  const userQuery = useQuery(
    "fetchUserData",
    () =>
      getUserInfo().then((res) => {
        setUserData(res);
      }),
    { staleTime: 5000, refetchOnWindowFocus: false }
  );
  const messageQuery = useQuery(
    "fetchMsgData",
    () =>
      getChannelMessageApi({
        id: uniqueIdentifier,
        chanId: uniqueIdentifier,
      }).then((res) => {
        if (res?.status == true) setMsgData(res.data);
      }),
    { staleTime: 500, refetchOnWindowFocus: false }
  );
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //MSG DATA UPDATE
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
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //CREATE ROOM WITH CHAN ID
  useEffect(() => {
    socket.emit(`room`, `${uniqueIdentifier}`);
    socket.on(`${uniqueIdentifier}`, (data) => {
      // console.log(data);
      messageQuery.refetch();
    });
    return () => {
      socket.off(`${uniqueIdentifier}`);
    };
  }, []);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //ON SUBMIT SEND MESSAGE
  const onSubmitSendMessage: SubmitHandler<FormValueSendMessage> = (data) => {
    data.chanId = uniqueIdentifier;
    data.time = new Date().getTime();
    data.displayname = userData.displayname;
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
          channel: `${uniqueIdentifier}`,
          message: data.message,
        });
      }
    });
    sendMsg.reset();
  };
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {errorDisplay ? (
          <ErrorNotification headerText={headerError} error={errorMsg} />
        ) : (
          <></>
        )}
        <div className={styles.chatWindow} ref={htmlMsgInput}>
          <LoadingPage />
        </div>
        <form
          className={styles.containerInForm}
          onSubmit={sendMsg.handleSubmit(onSubmitSendMessage)}
        >
          <input
            className={styles.input}
            type="text"
            placeholder=""
            {...sendMsg.register("message", { required: true })}
          />
          <input className={styles.buttonSend} type="submit" value="send" />
        </form>
      </div>
      <div className={styles.right}>
        <h1 className={styles.h1}>{chanData?.channelname}</h1>
        <div className={styles.buttonConfig} onClick={() => setPopup(true)}>
          Channel Options
        </div>
        <div
          className={styles.buttonConfig}
          onClick={() => onSubmitBlockUser()}
        >
          User Option
        </div>
        <div
          className={styles.buttonConfig}
          onClick={() => onSubmitLeaveChannel()}
        >
          Leave Channel
        </div>
        <hr className={styles.hr} />
        {/*<p>channel owner : {chanData?.owner}</p>*/}
        <p>Users :</p>
        <div ref={userRef} className={styles.htmlInput}>
          {" "}
          <LoadingPage />
        </div>
      </div>
      {popup ? (
        <>
          <div className={styles.layer} onClick={() => setPopup(false)}></div>
          <div className={styles.containerLayer}>
            <p className={styles.p}>Change channel type:</p>
            <div className={styles.changeType}>
              <div
                className={styles.buttonGlobal}
                onClick={() => onSubmitChangeType(1)}
              >
                Public
              </div>
              <div
                className={styles.buttonGlobal}
                onClick={() => onSubmitChangeType(2)}
              >
                Private
              </div>
              <div
                className={styles.buttonGlobal}
                onClick={() => onSubmitChangeType(3)}
              >
                Protected
              </div>
            </div>
            {chanData?.type == 2 ? (
              <>
                <p className={styles.p}>Invite user:</p>
                <form
                  className={styles.containerInForm3}
                  onSubmit={inviteUsr.handleSubmit(onSubmitInviteUsr)}
                >
                  <input
                    className={styles.input}
                    type="text"
                    placeholder=""
                    {...inviteUsr.register("id", { required: true })}
                  />
                  <input
                    className={styles.buttonSend2}
                    type="submit"
                    value="Invite"
                  />
                </form>
              </>
            ) : (
              <></>
            )}
            <p className={styles.p}>Kick user:</p>
            <form
              className={styles.containerInForm3}
              onSubmit={kickUsr.handleSubmit(onSubmitKickUsr)}
            >
              <input
                className={styles.input}
                type="text"
                placeholder=""
                {...kickUsr.register("id", { required: true })}
              />
              <input
                className={styles.buttonSend2}
                type="submit"
                value="Kick"
              />
            </form>
            <p className={styles.p}>Ban user:</p>
            <form
              className={styles.containerInForm3}
              onSubmit={banUsr.handleSubmit(onSubmitBanUsr)}
            >
              <input
                className={styles.input}
                type="text"
                placeholder=""
                {...banUsr.register("id", { required: true })}
              />
              <input className={styles.buttonSend2} type="submit" value="Ban" />
            </form>
            <p className={styles.p}>Unban user:</p>
            <form
              className={styles.containerInForm3}
              onSubmit={unbanUsr.handleSubmit(onSubmitUnbanUsr)}
            >
              <input
                className={styles.input}
                type="text"
                placeholder=""
                {...unbanUsr.register("id", { required: true })}
              />
              <input
                className={styles.buttonSend2}
                type="submit"
                value="Unban"
              />
            </form>
            <p className={styles.p}>Add administrator:</p>
            <form
              className={styles.containerInForm3}
              onSubmit={addAdmin.handleSubmit(onSubmitAddAdmin)}
            >
              <input
                className={styles.input}
                type="text"
                placeholder=""
                {...addAdmin.register("id", { required: true })}
              />
              <input className={styles.buttonSend2} type="submit" value="Add" />
            </form>
            <p className={styles.p}>Remove administrator:</p>
            <form
              className={styles.containerInForm3}
              onSubmit={removeAdmin.handleSubmit(onSubmitRemoveAdmin)}
            >
              <input
                className={styles.input}
                type="text"
                placeholder=""
                {...removeAdmin.register("id", { required: true })}
              />
              <input
                className={styles.buttonSend2}
                type="submit"
                value="Remove"
              />
            </form>
            <p className={styles.p}>Mute user:</p>
            <form
              className={styles.containerInForm3}
              onSubmit={muteUser.handleSubmit(onSubmitMuteUser)}
            >
              <input
                className={styles.input}
                type="text"
                placeholder=""
                {...muteUser.register("id", { required: true })}
              />
              <input
                className={styles.input2}
                type="number"
                placeholder="time in s"
                {...muteUser.register("time", { required: true })}
              />
              <input
                className={styles.buttonSend2}
                type="submit"
                value="Mute"
              />
            </form>
          </div>
        </>
      ) : (
        <></>
      )}
      {displayPw ? (
        <>
          <div
            className={styles.layer}
            onClick={() => setDisplayPw(false)}
          ></div>
          <div
            className={styles.getPassword}
            onClick={() => setDisplayPw(true)}
          >
            <h2 className={styles.h2}>Channel Password</h2>
            <form
              className={styles.containerInForm2}
              onSubmit={registerPw.handleSubmit(onSubmitChannelTypePw)}
            >
              <div className={styles.inputDiv}>
                <input
                  className={styles.input}
                  type="password"
                  placeholder=""
                  {...registerPw.register("password", { required: true })}
                />
              </div>
              <input className={styles.buttonSend} type="submit" value="Join" />
            </form>
          </div>
        </>
      ) : (
        <div></div>
      )}
      {displayBlockUser ? (
        <>
          <div
            className={styles.layer}
            onClick={() => setDisplayBlockUser(false)}
          ></div>
          <div
            className={styles.getPassword}
            onClick={() => setDisplayBlockUser(true)}
          >
            <p className={styles.p}>Block User</p>
            <form
              className={styles.containerInForm3}
              onSubmit={blockUser.handleSubmit(onSubmitBlockUserForm)}
            >
              <div className={styles.inputDiv}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder=""
                  {...blockUser.register("id", { required: true })}
                />
              </div>
              <input
                className={styles.buttonSend}
                type="submit"
                value="Block"
              />
            </form>
            <p className={styles.p}>Unblock User</p>
            <form
              className={styles.containerInForm3}
              onSubmit={unblockUser.handleSubmit(onSubmitUnBlockUserForm)}
            >
              <div className={styles.inputDiv}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder=""
                  {...unblockUser.register("id", { required: true })}
                />
              </div>
              <input
                className={styles.buttonSend}
                type="submit"
                value="unBlock"
              />
            </form>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Channel;
