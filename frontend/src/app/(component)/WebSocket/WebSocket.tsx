"use client";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./websocket.module.css";
import { useRouter } from "next/navigation";
import {getUserInfo} from "@/app/auth/auth.api";
import { socket as sock } from '@/app/socket'


const socket = sock.connect();


export const WebSocket = (user: any) => {
    const [needRefresh, setNeedRefresh] = useState<boolean>(true);
    const refDiv: MutableRefObject<any> = useRef();
    const router = useRouter();
    
    useEffect(() => {
        // setTimeout(() => {
        //     needRefresh ? router.refresh() : () => {};
        // },10000);
        socket.on(`ping`, (data) => {
            getUserInfo().then((res) => {
                socket.emit('pong', res);
            })
        });
        socket.on('connectedUser', (data) => {
            refDiv.current.innerText = 'Current users: ' + data?.data.length;
            localStorage.setItem('connectedUser', JSON.stringify(data?.data));
            setNeedRefresh(false)
        });
        // console.log(`this is user.id avant le emit = ${user.id}`)
        socket.emit('storeClientInfo', {
            userId: user,
            socketId: socket.id,
        });
        return () => {
            socket.off('ping');
            socket.off('connectedUser');
            socket.disconnect();
        }
    },[]);
    return (
        <div ref={refDiv} className={styles.container}>
            Connected user: 1
        </div>
    )
}

