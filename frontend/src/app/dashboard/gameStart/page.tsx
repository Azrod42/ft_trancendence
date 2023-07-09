  "use client"

  import React, {useContext, useEffect, useRef, useState} from 'react';
  import { io, Socket } from 'socket.io-client';
  import {UserAuthResponse, logout, getUserInfo, getProfilePicture} from '@/app/auth/auth.api';
  import { useRouter } from 'next/navigation';
  import {useQuery} from "react-query";
  import styles from "./gameStart.module.css"
  import {WebsocketContext} from "@/app/(common)/WebsocketContext";
    
  function MessageForm() {
    //GET USER DATA FROM BACKEND AND STORE IN useState
    let [userData, setuserData] = useState<UserAuthResponse>();
    const { push } = useRouter();
    const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
      getUserInfo().then(res => {
        if (res == undefined)
          push('/');
        setuserData(res);
      }), {refetchInterval: 1000 * 60 * 2, refetchOnWindowFocus: false}
    );
    useEffect(() => {
      if (userData == undefined) {
        refetch()
      }
    })
    useEffect(() => {
      //for setup action on userData refresh ?
      setShowUserInfo(true);
    },[userData])
  
    const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
    const [socket] = useState(useContext(WebsocketContext));

    useEffect(() => {
      socket.emit('gameRoom', 'ready-to-play');
      socket.on('ready-to-play', (data) => {
        console.log(data);
      })
      return () => {
        socket.off('ready-to-play');
      }
    }, [])

  
    return (
      <div >
        {showUserInfo  && (
          <div className={styles.containerGameStart}>
            <p>Name: {userData?.displayname }</p>
            <p>ID: {userData?.id}</p>
            <p>Socket ID: {socket.id}</p>
          </div>
        )}
      </div>
    );
  }
  
  export default MessageForm;
  