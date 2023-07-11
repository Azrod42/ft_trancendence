"use client"

import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from "./room.module.css";
import {useParams, useRouter} from "next/navigation";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";
import {getUserInfo, PublicUserResponse, UserAuthResponse} from "@/app/auth/auth.api";
import {useQuery} from "react-query";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;


interface RoomProps {
}

export type DataEndGame = {
  idGame: string;
};

const Room: React.FC<RoomProps> = () => {
  const refDiv: React.MutableRefObject<any> = useRef();
  const [socket] = useState(useContext(WebsocketContext));
  const uniqueIdentifier = useParams()?.room;

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  //GET USERS DATA FROM BACKEND AND DISPLAY IT
  let [userData, setuserData] = useState<UserAuthResponse>();
  const { push } = useRouter();
  const { refetch } = useQuery('getUserInfo', () =>
      getUserInfo().then(res => {
        if (res == undefined)
          push('/');
        setuserData(res);
      }), { staleTime: 5000 }
  );
  useEffect(() => {
    if (userData == undefined) {
      refetch()
    }
  })
  useEffect(() => {
    //for setup action on userData refresh ?
  },[userData])
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

  useEffect(() => {
    socket.emit('room', uniqueIdentifier);
    socket.on(`${uniqueIdentifier}`, (data) => {
      console.log(data?.user, ": Y = ", data?.y);
    })
    return () => {
      socket.off(`${uniqueIdentifier}`);
    }
  },[]);

  useEffect(() => { // mouvements souris
    refDiv.current.addEventListener('mousemove', (data : any) => {
      socket.emit('move', {idRoom: uniqueIdentifier, user: userData?.username, y: data?.screenY})
    } )
  }, []);

  return (
    <div className={styles.container} ref={refDiv}>
    </div>
  );
};

export default Room;