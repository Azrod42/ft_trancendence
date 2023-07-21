"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./profile.module.css";
import stylesGrid from "./grid.module.css";
import Image from "next/image";
import {
  changeDisplayName,
  disable2fa,
  getProfilePicture,
  getUserInfo, notInGame,
  uploadProfilePicture,
  UserAuthResponse,
} from "@/app/auth/auth.api";
import { AiOutlineEdit } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Api from "@/app/api/api";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/app/(component)/loadingPage/loadingPage";
import { postGameHist, postUserStats } from "@/app/dashboard/social/social.api";

export type FormDisplayName = {
  displayname: string;
};

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  Api.init();
  const [loading, setLoading] = useState<boolean>(true);

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //GET PROFILE IMAGE
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [ppGet, setPpGet] = useState<boolean>(false);
  if (!ppGet) {
    getProfilePicture().then((res) => {
      setProfilePicture("data:image/png;base64, " + res?.data);
    });
    setPpGet(true);
  }
  useEffect(() => {
    // console.log(profilePicture);
  }, [profilePicture]);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  //GET USERS DATA FROM BACKEND AND DISPLAY IT
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
    //for setup action on userData refresh ?
    setLoading(false);
  }, [userData]);
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
  //HANDLE CHANGE DISPLAY NAME RENAME
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDisplayName>();
  const [upDisplayName, setUpDisplayName] = useState<boolean>(false);
  function btnDisplayName(): void {
    setUpDisplayName(!upDisplayName);
  }
  const onSubmit: SubmitHandler<FormDisplayName> = (data) => {
    if (upDisplayName) setUpDisplayName(!upDisplayName);
    mutation.mutate(data);
  };
  //QUERY TO MAKE API CALL TO BACKEND (rename)
  const mutation = useMutation({
    mutationFn: (data: FormDisplayName) => {
      Api.init();
      return changeDisplayName(data);
    },
    onSuccess: () => {
      setTimeout(() => {
        refetch();
      }, 100);
    },
  });
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
  //UPLOAD FILE ON USER ADD ONE
  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No file was chosen");
      return;
    }
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }
    const file = fileInput.files[0];

    if (!file.type.startsWith("image")) {
      alert("Please select a valide image");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    mutationProfilePicture.mutate(formData);
  };
  const mutationProfilePicture = useMutation({
    mutationFn: (data: FormData) => {
      Api.init();
      return uploadProfilePicture(data);
    },
    onSuccess: () => {
      setTimeout(() => {
        refetch();
        setPpGet(false);
      }, 100);
    },
  });
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const loadImage = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    loadImage();
  }, [elo]);
  useEffect(() => {
    notInGame().then((res) => {});
  },[])

  const [localConnectedUser, setLocalConnectedUser] = useState<any>([])
  const [ig, setIg] = useState<string>('In menu')

  useEffect(() => {
    const iner = setInterval(() => {
      if (localStorage.getItem("connectedUser")) {
        setLocalConnectedUser(JSON.parse(localStorage.getItem("connectedUser")!));
      }
    }, 3000);
    return () => clearInterval(iner);
  },[]);

  useEffect(() => {
    for (let i = 0; localConnectedUser[i]; i++) {
      if (localConnectedUser[i]?.id == userData?.id){
        if (localConnectedUser[i].inGame) {
          setIg('In game');
        } else {
          setIg('In menu')
        }
      }
    }
  }, [localConnectedUser])

  return (
    <div className={stylesGrid.container}>
      <div className={stylesGrid.section_a}>
        {loading ? (
          <LoadingComponent />
        ) : (
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
              <div className={styles.imageLeft}>
                <div className={styles.tophr}>
                  <p className={styles.userHeader_displayname}>
                    {userData?.displayname}
                  </p>
                  <p className={styles.igStatus}>Status : {ig}</p>
                </div>
                <hr className={styles.hr} />
              </div>
            </div>
            <div className={styles.userHeader_profileInfo}>
              <span className={styles.itemProfileInfo}>
                <span className={styles.itemTitleProfileInfo}>
                  Display Name :
                </span>
                {upDisplayName ? (
                  <span className={styles.flexRow}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        type={"text"}
                        {...register("displayname", { required: true })}
                      ></input>
                    </form>
                    <FiCheck
                      className={styles.AiOutlineEdit}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </span>
                ) : (
                  <span>
                    {userData?.displayname}{" "}
                    <AiOutlineEdit
                      className={styles.AiOutlineEdit}
                      onClick={btnDisplayName}
                    />{" "}
                  </span>
                )}
              </span>
              <span className={styles.itemProfileInfo}>
                <span className={styles.itemTitleProfileInfo}>Username :</span>
                <span>{userData?.username}</span>
              </span>
              <span className={styles.itemProfileInfo}>
                <span className={styles.itemTitleProfileInfo}>Email :</span>
                <span>{userData?.email}</span>
              </span>
              <span className={styles.itemProfileInfo}>
                <span className={styles.itemTitleProfileInfo}>
                  Change avatar:
                </span>
                <form action="">
                  <input
                    className={styles.itemFileInputProfileInfo}
                    name="file"
                    type="file"
                    onChange={onFileUploadChange}
                  />
                </form>
              </span>
              <span className={styles.itemProfileInfo}>
                <span className={styles.itemTitleProfileInfo}>Enable 2fa:</span>
                {!userData?.is2FOn ? (
                  <input
                    name="2fa"
                    type="button"
                    value="Turn on"
                    onClick={() => {
                      push("/dashboard/profile/enable-2fa");
                    }}
                  />
                ) : (
                  <input
                    name="2fa"
                    type="button"
                    value="Turn off"
                    onClick={() => {
                      disable2fa().then(() => {
                        refetch();
                      });
                    }}
                  />
                )}
              </span>
            </div>
          </div>
        )}
        <div className={styles.section_a_containerBottom}>
          <h1 className={styles.h1_section_a}>STATS</h1>
          <hr className={styles.hr} />
          <p className={styles.p_section_a}>
            Game Win:{" "}
            <span className={styles.p_section_a_value}>{gameWin}</span>
          </p>
          <p className={styles.p_section_a}>
            Game Lose:{" "}
            <span className={styles.p_section_a_value}>{gameLose}</span>
          </p>
          <p className={styles.p_section_a}>
            Win/Lose Rate:{" "}
            <span className={styles.p_section_a_value}>{winLoseRate}</span>
          </p>
          <p className={styles.p_section_a}>
            Total Points Get:{" "}
            <span className={styles.p_section_a_value}>{totalPointGet}</span>
          </p>
          <p className={styles.p_section_a}>
            Total Points Take:{" "}
            <span className={styles.p_section_a_value}>{totalPointTake}</span>
          </p>
          <p className={styles.p_section_a}>
            Point Get/Take Rate:{" "}
            <span className={styles.p_section_a_value}>{pointGetTakeRate}</span>
          </p>
          <p className={styles.p_section_a}>
            Win Streak:{" "}
            <span className={styles.p_section_a_value}>{winStreak}</span>
          </p>
          <p className={styles.p_section_a}>
            Total Games:{" "}
            <span className={styles.p_section_a_value}>{totalGame}</span>
          </p>
        </div>
      </div>
      <div className={stylesGrid.section_b}>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className={styles.section_b_container}>
            <p
              className={`${styles.section_d_gamesitems} ${styles.section_b_header}`}
            >
              RANK
            </p>
            {elo <= 600 && (
              <div className={styles.rankIcon}>
                <Image
                  src={"/media/rank/Bronze_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Bronze Rank"
                />
              </div>
            )}
            {elo >= 601 && elo <= 800 && (
              <div className={styles.rankIcon}>
                <Image
                  src={"/media/rank/Silver_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Silver Rank"
                />
              </div>
            )}
            {elo >= 801 && elo <= 1000 && (
              <div className={styles.rankIcon}>
                <Image
                  src={"/media/rank/Gold_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Gold Rank"
                />
              </div>
            )}
            {elo >= 1001 && elo <= 1200 && (
              <div className={styles.rankIcon}>
                <Image
                  src={"/media/rank/Diamond_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Diamond Rank"
                />
              </div>
            )}
            {elo >= 1201 && (
              <div className={styles.rankIcon}>
                <Image
                  src={"/media/rank/Platinum_3_Rank.png"}
                  width={128}
                  height={128}
                  alt="Platinum Rank"
                />
              </div>
            )}
            <div className={styles.rankNameContainer}>
              {elo <= 600 && <p className={styles.rankName}>Bronze</p>}
              {elo >= 601 && elo <= 800 && (
                <p className={styles.rankName}>Silver</p>
              )}
              {elo >= 801 && elo <= 1000 && (
                <p className={styles.rankName}>Gold</p>
              )}
              {elo >= 1001 && elo <= 1200 && (
                <p className={styles.rankName}>Diamond</p>
              )}
              {elo >= 1201 && <p className={styles.rankName}>Platinum</p>}
            </div>
          </div>
        )}
      </div>
      <div className={styles.section_c_container}>
        <p
          className={`${styles.section_d_gamesitems} ${styles.section_b_header}`}
        >
          LEVEL
        </p>
        <div className={styles.levelContainer}>
          <p className={styles.levelText}>
            Level {Math.floor(Math.sqrt(xp / 100) + 1)}
          </p>
          <p className={styles.xpText}>{xp} XP</p>
        </div>
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

export default Profile;
