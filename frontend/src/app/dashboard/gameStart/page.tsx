  "use client"

  import React, { useEffect, useRef, useState } from 'react';
  import { io, Socket } from 'socket.io-client';
  import {UserAuthResponse, logout, getUserInfo, getProfilePicture} from '@/app/auth/auth.api';
  import { useRouter } from 'next/navigation';
  import {useQuery} from "react-query";
  import styles from "./gameStart.module.css"
    
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
    },[userData])
  
    const socketRef = useRef<Socket | null>(null);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [socketId, setSocketId] = useState<string | null>(null);
  
    useEffect(() => {
      return () => {
        // disconnect socket when component unmounts
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }, []);
  
    const handleSocketConnection = () => {
      socketRef.current = io('http://localhost:3003');
      if(socketRef.current){
        socketRef.current.on('connect', () => {
          if(socketRef.current) {
            setSocketId(socketRef.current.id);
          }
        });
      }
      setShowUserInfo(true);
    };
  
    return (
      <div >
        <button type="button" onClick={handleSocketConnection}>Connect to Socket Server</button>
        {showUserInfo  && (
          <div className={styles.containerGameStart}>
            <p>Name: {userData?.displayname }</p>
            <p>ID: {userData?.id}</p>
            <p>Socket ID: {socketId}</p>
          </div>
        )}
      </div>
    );
  }
  
  export default MessageForm;
  