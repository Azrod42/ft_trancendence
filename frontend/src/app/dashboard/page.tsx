"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./dashboard.module.css";
import ConnectedUser from "@/app/(component)/connectedUser/connectedUser";
import DashboardUser from "@/app/(component)/dashboardUser/dashboardUser";
import { postGameData } from "@/app/dashboard/social/social.api";
import { postUserStats } from "@/app/dashboard/social/social.api";
import Image from "next/image";
import stylesGrid from "@/app/dashboard/profile/grid.module.css";
import { useQuery } from "react-query";
import {getUserInfo, notInGame} from "@/app/auth/auth.api";
import { useRouter } from "next/navigation";
import {location} from "@sideway/pinpoint";

interface DashboardProps {}

export type DataEndGameDB = {
  idGame: string;
  idWinner: string;
  idLoser: string;
  scoreWinner: number;
  scoreLoser: number;
  ranked: boolean;
};
const Dashboard: React.FC<DashboardProps> = ({}) => {
  if (!localStorage.getItem('reload')) {
    localStorage.setItem('reload', '1');
    window.location.reload();
  }
  let [userData, setuserData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

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
    }
  }, [userData]);

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

  function testRequest() {
    const data: DataEndGameDB = {
      idGame: "e8e878c7-ds3c-461b-a7cf-bbefed7b87de",
      idWinner: "cfd704db-1c21-4b44-b692-dbcfd3f5baf4",
      idLoser: "9ada0c55-e14d-461e-b54d-f8da11b7d37e",
      scoreLoser: 2,
      scoreWinner: 3,
      ranked: true,
    };
    postGameData(data).then((res) => {
      console.log(res);
    });
  }

  useEffect(() => {
    notInGame().then((res) => {});
  },[])

  return (
    <div className={styles.container}>
      <div className={styles.containerchild}>
        <DashboardUser />
      </div>
      <div className={styles.containerchild}>
        <h2 className={styles.h2ConUsr}>Connected users:</h2>
        <ConnectedUser />
      </div>
      <div className={styles.section_a_containerBottom}>
        <p className={styles.p_section_a}>
          Game Win: <span className={styles.p_section_a_value}>{gameWin}</span>
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
      <div className={stylesGrid.section_b}>
        <div className={styles.section_b_container}>
          {elo >= 400 && elo <= 600 && (
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
                src={"/media/rank/Silver_3_Rank.png"}
                width={128}
                height={128}
                alt="Platinum Rank"
              />
            </div>
          )}
          <div className={styles.rankNameContainer}>
            {elo >= 400 && elo <= 600 && (
              <p className={styles.rankName}>Bronze</p>
            )}
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
      </div>
      <div className={styles.section_c_container}>
        <div className={styles.levelContainer}>
          <p className={styles.levelText}>Level {Math.floor(Math.sqrt(xp / 100) + 1)}</p>
          <p className={styles.xpText}>{xp} XP</p>
        </div>
      </div>
      <div className={styles.containerchild}>
        <button onClick={testRequest}>CLIC CLIC</button>
      </div>
    </div>
  );
};

export default Dashboard;
