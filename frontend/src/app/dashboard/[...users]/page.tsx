"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./users.module.css";
import styles2 from "../social/chat/[...chat-message]/chatMessage.module.css";
import styles3 from "@/app/dashboard/profile/profile.module.css";
import { useMutation, useQuery } from "react-query";
import Api from "@/app/api/api";
import {
  addBlock,
  addChat,
  addFriend,
  getBlockList,
  getChatList,
  getFriendList,
  getPublicUserInfo,
  getUserInfo,
  notInGame,
  postProfilePicture,
  removeBlock,
  removeChat,
  removeFriend,
  setSlot,
  UserAuthResponse,
} from "@/app/auth/auth.api";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import stylesGrid from "./grid.module.css";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";
import { postGameHist, postUserStats } from "@/app/dashboard/social/social.api";
import LoadingComponent from "@/app/(component)/loadingPage/loadingPage";
import { getWebSocketIdByUserId } from "@/app/auth/auth.api";
import uuid from "react-uuid";
import { setGameNumber } from "@/app/auth/auth.api";
import { WebsocketContext } from "@/app/(common)/WebsocketContext";

interface UserProps {}
interface MyPageProps {
  id: string;
}

const User: React.FC<UserProps> = ({}) => {
  const [self, setself] = useState<boolean>(true);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //GET PROFILE IMAGE
  const urlParam: string = usePathname().split("/").pop()!;
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [ppGet, setPpGet] = useState<boolean>(false);
  if (!ppGet) {
    postProfilePicture(urlParam).then((res) => {
      setProfilePicture("data:image/png;base64, " + res?.data);
    });
    setPpGet(true);
  }
  useEffect(() => {
    // console.log(profilePicture);
  }, [profilePicture]);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  //GET PUBLIC USERS DATA FROM BACKEND AND DISPLAY IT
  let [userData, setuserData] = useState<any>();
  const { isLoading, error, data, refetch } = useQuery("getUserInfo", () => {
    const userID = { id: urlParam };
    getPublicUserInfo(urlParam).then((res) => {
      setuserData(res?.data);
    }),
      { staleTime: 5000 };
  });
  useEffect(() => {
    if (userData == undefined) {
      refetch();
    }
  });
  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  //GET USERS DATA FROM BACKEND AND DISPLAY IT
  let [selfData, setselfData] = useState<UserAuthResponse>();
  const { push } = useRouter();
  useEffect(() => {
    getUserInfo().then((res) => {
      if (res == undefined) push("/");
      setselfData(res);
    });
  }, [userData]);
  useEffect(() => {
    if (selfData?.id == urlParam) {
      setself(true);
    } else {
      setself(false);
    }
  }, [selfData]);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  const userId: string = usePathname().split("/").pop()!;

  const [errorClick, setErrorClick] = useState<boolean>(false);
  const [headerError, setHeaderError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (userData?.id == urlParam) {
      setself(true);
    } else {
      setself(false);
    }
  }, [userData]);

  function onClickAddFriend() {
    const dtoId = { id: userId };
    addFriend(dtoId).then((res) => {
      if (!res?.data) {
        setHeaderError("Error:");
        setErrorMsg("Failed to add friend");
        setErrorClick(true);
        setTimeout(() => {
          setErrorClick(false);
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
        setErrorClick(true);
        setTimeout(() => {
          setErrorClick(false);
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
        setErrorClick(true);
        setTimeout(() => {
          setErrorClick(false);
        }, 5000);
      } else {
        //console.log(res);
      }
    });
  }

  function onClickRemoveBlock() {
    const dtoId = { id: userId };
    removeBlock(dtoId).then((res) => {
      if (!res?.data) {
        setHeaderError("Error:");
        setErrorMsg("Failed to remove block");
        setErrorClick(true);
        setTimeout(() => {
          setErrorClick(false);
        }, 5000);
      } else {
        //console.log(res);
      }
    });
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  const [elo, setElo] = useState<number>(800);
  const [xp, setXp] = useState<number>(0);
  const [gameWin, setGameWin] = useState(0);
  const [gameLose, setGameLose] = useState(0);
  const [winLoseRate, setWinLoseRate] = useState("");
  const [totalPointGet, setTotalPointGet] = useState(0);
  const [totalPointTake, setTotalPointTake] = useState(0);
  const [pointGetTakeRate, setPointGetTakeRate] = useState("");
  const [winStreak, setWinStreak] = useState(0);
  const [totalGame, setTotalGame] = useState(0);
  const refHist: React.MutableRefObject<any> = useRef();
  useEffect(() => {
    if (userData?.id) {
      postUserStats({ id: userData?.id! }).then((res: any) => {
        setElo(parseInt(res?.data?.elo));
        setXp(res?.data?.xp);
        setGameWin(res?.data?.gameWin);
        setGameLose(res?.data?.gameLose);
        setWinLoseRate(res?.data?.winLoseRate);
        setTotalPointGet(res?.data?.totalPointGet);
        setTotalPointTake(res?.data?.totalPointTake);
        setPointGetTakeRate(res?.data?.pointGetTakeRate);
        setWinStreak(res?.data?.winStreak);
        setTotalGame(res?.data?.totalGame);
      });
      postGameHist({ id: userData?.id! }).then((res: any) => {
        let tab = [];
        if (res.data) tab = JSON.parse(JSON.stringify(res.data));
        let html = `<style>
                                .gameHist {
                                  width: 90%;
                                  height: 50px;
                                  border-radius: 5px;
                                  box-shadow: 0 0 3px #ef5da8;
                                  color: whitesmoke;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  background-color: #060b18cc;
                                  min-height: 50px;
                                }
                            </style>`;
        for (let i = 0; tab[i]; i++) {
          const ranked: string = tab[i].ranked ? "Ranked" : "Unranked";
          html += `<div class="gameHist">${tab[i].dnW} ${tab[i].scoreW} - ${tab[i].scoreL} ${tab[i].dnL} &nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp ${ranked}</div>`;
        }
        refHist.current.innerHTML = html;
      });
    }
  }, [userData]);

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

  const [isLoadingRank, setIsLoadingRank] = useState(true);

  useEffect(() => {
    setIsLoadingRank(true);

    const loadImage = () => {
      setTimeout(() => {
        setIsLoadingRank(false);
      }, 800);
    };

    loadImage();
  }, [elo]);

  const [isXpLoading, setIsXpLoading] = useState(true);

  useEffect(() => {
    setIsXpLoading(true);

    const loadImage = () => {
      setTimeout(() => {
        setIsXpLoading(false);
      }, 800);
    };

    loadImage();
  }, [xp]);

  const [isStatLoading, setIsStatLoading] = useState(true);

  useEffect(() => {
    setIsStatLoading(true);

    const loadImage = () => {
      setTimeout(() => {
        setIsStatLoading(false);
      }, 800);
    };

    loadImage();
  }, [userData]);

  useEffect(() => {
    notInGame().then((res) => {});
  }, []);

  const [localConnectedUser, setLocalConnectedUser] = useState<any>([]);
  const [ig, setIg] = useState<string>("In menu");

  useEffect(() => {
    const iner = setInterval(() => {
      if (localStorage.getItem("connectedUser")) {
        setLocalConnectedUser(
          JSON.parse(localStorage.getItem("connectedUser")!)
        );
      }
    }, 3000);
    return () => clearInterval(iner);
  }, []);

  useEffect(() => {
    for (let i = 0; localConnectedUser[i]; i++) {
      if (localConnectedUser[i]?.id == userData?.id) {
        if (localConnectedUser[i].inGame) {
          setIg("In game");
        } else {
          setIg("In menu");
        }
      }
    }
  }, [localConnectedUser]);

  return (
    <div className={stylesGrid.container}>
      <div className={stylesGrid.section_a}>
        <div className={styles.section_a_containerTop}>
          <div className={styles.section_a_userHeader}>
            {profilePicture && (
              <Image
                className={styles.section_a_userHeaderImg}
                src={!ppGet ? "/media/logo-login.png" : profilePicture}
                alt="profile-picture"
                width={128}
                height={128}
                priority={true}
              />
            )}
            <p className={styles.userHeader_displayname}>
              {userData?.displayname}
            </p>
            <p className={styles.igStatus}>Status : {ig}</p>
          </div>
          <hr className={styles.hr} />
          <div className={styles2.containerChatWith}>
            <div className={styles2.buttonContainer}>
              <div
                className={`${styles2.playButton} ${styles2.chatWith}`}
                onClick={() => handleFightClick(userId)}
              >
                PLAY
              </div>
              <div className={styles2.chatWith} onClick={onClickAddFriend}>
                Add friend
              </div>
              <div className={styles2.chatWith} onClick={onClickAddBlock}>
                Block user
              </div>
            </div>
            <div className={styles2.buttonContainer}>
              <div className={styles2.chatWith} onClick={onClickRemoveFriend}>
                Remove-friend
              </div>
              <div className={styles2.chatWith} onClick={onClickRemoveBlock}>
                Remove-block
              </div>
            </div>
          </div>
          {errorClick && (
            <ErrorNotification headerText={headerError} error={errorMsg} />
          )}
        </div>
        <div className={styles3.section_a_containerBottom}>
          <h1 className={styles3.h1_section_a}>STATS</h1>
          <hr className={styles3.hr} />
          {isStatLoading ? (
            <LoadingComponent />
          ) : (
            <div>
              <p className={styles3.p_section_a}>
                Game Win:{" "}
                <span className={styles3.p_section_a_value}>{gameWin}</span>
              </p>
              <p className={styles3.p_section_a}>
                Game Lose:{" "}
                <span className={styles3.p_section_a_value}>{gameLose}</span>
              </p>
              <p className={styles3.p_section_a}>
                Win/Lose Rate:{" "}
                <span className={styles3.p_section_a_value}>{winLoseRate}</span>
              </p>
              <p className={styles3.p_section_a}>
                Total Points Get:{" "}
                <span className={styles3.p_section_a_value}>
                  {totalPointGet}
                </span>
              </p>
              <p className={styles3.p_section_a}>
                Total Points Take:{" "}
                <span className={styles3.p_section_a_value}>
                  {totalPointTake}
                </span>
              </p>
              <p className={styles3.p_section_a}>
                Point Get/Take Rate:{" "}
                <span className={styles3.p_section_a_value}>
                  {pointGetTakeRate}
                </span>
              </p>
              <p className={styles3.p_section_a}>
                Win Streak:{" "}
                <span className={styles3.p_section_a_value}>{winStreak}</span>
              </p>
              <p className={styles3.p_section_a}>
                Total Games:{" "}
                <span className={styles3.p_section_a_value}>{totalGame}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={stylesGrid.section_b}>
        {isLoadingRank ? (
          <LoadingComponent />
        ) : (
          <div className={styles3.section_b_container}>
            <p
              className={`${styles3.section_d_gamesitems} ${styles3.section_b_header}`}
            >
              RANK
            </p>
            {elo <= 600 && (
              <div className={styles3.rankIcon}>
                <Image
                  src={"/media/rank/Bronze_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Bronze Rank"
                />
              </div>
            )}
            {elo >= 601 && elo <= 800 && (
              <div className={styles3.rankIcon}>
                <Image
                  src={"/media/rank/Silver_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Silver Rank"
                />
              </div>
            )}
            {elo >= 801 && elo <= 1000 && (
              <div className={styles3.rankIcon}>
                <Image
                  src={"/media/rank/Gold_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Gold Rank"
                />
              </div>
            )}
            {elo >= 1001 && elo <= 1200 && (
              <div className={styles3.rankIcon}>
                <Image
                  src={"/media/rank/Diamond_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Diamond Rank"
                />
              </div>
            )}
            {elo >= 1201 && (
              <div className={styles3.rankIcon}>
                <Image
                  src={"/media/rank/Platinum_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Platinum Rank"
                />
              </div>
            )}
            <div className={styles3.rankNameContainer}>
              {elo <= 600 && <p className={styles3.rankName}>Bronze</p>}
              {elo >= 601 && elo <= 800 && (
                <p className={styles3.rankName}>Silver</p>
              )}
              {elo >= 801 && elo <= 1000 && (
                <p className={styles3.rankName}>Gold</p>
              )}
              {elo >= 1001 && elo <= 1200 && (
                <p className={styles3.rankName}>Diamond</p>
              )}
              {elo >= 1201 && <p className={styles3.rankName}>Platinum</p>}
            </div>
          </div>
        )}
      </div>
      <div className={styles3.section_c_container}>
        <p
          className={`${styles3.section_d_gamesitems} ${styles3.section_b_header}`}
        >
          LEVEL
        </p>
        {isXpLoading ? (
          <LoadingComponent />
        ) : (
          <div className={styles3.levelContainer}>
            <p className={styles3.levelText}>
              Level {Math.floor(Math.sqrt(xp / 100) + 1)}
            </p>
            <p className={styles3.xpText}>{xp} XP</p>
          </div>
        )}
      </div>
      <div className={stylesGrid.section_d}>
        <div className={styles.section_d_container}>
          <h1 className={styles.section_d_h1}>Last games</h1>
          <hr className={styles.hr} />
          <div className={styles.section_d_games} ref={refHist}>
            <LoadingComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
