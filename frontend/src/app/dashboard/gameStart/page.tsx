'use client'  

import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from './gameStart.module.css';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/app/(component)/loadingPage/loadingPage';
import Image from 'next/image';
import {getUserInfo, postProfilePicture} from "@/app/auth/auth.api";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";
import { getWebSocketIdByUserId } from "@/app/auth/auth.api";
import uuid from "react-uuid"



interface UserLog {
  id: string;
  displayname: string;
  img: string;
}

interface gameStartProps {}

const GameStart: React.FC<gameStartProps> = ({}) => {
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [userData, setUserData] = useState<any>();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { push, refresh } = useRouter();
  const [socket] = useState(useContext(WebsocketContext))


  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) {
        setUserData(data);
      }
    });
  },[]);

  useEffect(() => {
    const fetchData = async () => {
      const local = localStorage.getItem('connectedUser');
      setCurrentUserId(userData?.id);
      setCurrentUserName(userData?.username);
      console.log(`this is currentUserId au niveau du changement = ${currentUserId}`) 
      console.log(`this is currentUserName au niveau du changement = ${currentUserName}`) 
      if (local && currentUserId) {
        let userLog = JSON.parse(local);
        if (currentUserId) {
          userLog = userLog.filter((user: UserLog) => user.id !== currentUserId);
        }
        for (let i = 0; userLog[i]; i++) {
          const img = await postProfilePicture(userLog[i].id);
          userLog[i].img = img?.data;
        }
        setUserLogs(userLog);
        setIsLoading(false);
      } else {
        setTimeout(() => {
          refresh();
        }, 5000);
      }
    };
    if(userData) {
      fetchData();
    }
  }, [userData, currentUserId, currentUserName]);

  const handleFightClick = (id: string) => {
    console.log(`Fight with user: ${id}`);

    getWebSocketIdByUserId(id).then((res) => {
    console.log(`This is res.data = ${res?.data}`);
    console.log(`This is currentUserId = ${currentUserId}`);
    const uid = uuid();
    socket.emit('duelRequest', {socketId: res?.data, idRoom: uid, currentUserId: currentUserId, currentUserName: currentUserName});
    push(`/dashboard/game/${uid}`);
    })
};



  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des utilisateurs connectés</h2>
      <div className={styles.users}>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className={styles.userContainer}>
            {userLogs.map((user) => (
              <div key={user.id} className={styles.userlogcontainer}>
                <div onClick={() => push(`/dashboard/user/${user.id}`)} className={styles.row}>
                  <Image
                    className={styles.img}
                    src={`data:image/png;base64,${user.img}`}
                    alt={user.displayname}
                    width={50}
                    height={50}
                  />
                  <p className={`${styles.userlogp} ${styles.whiteText}`}>{user.displayname}</p>
                </div>
                  <button onClick={() => handleFightClick(user.id)} className={styles.fightButton}>Fight</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default GameStart;
