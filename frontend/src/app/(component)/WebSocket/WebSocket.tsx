"use client";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WebsocketContext } from "@/app/(common)/WebsocketContext";
import styles from "./websocket.module.css";
import { useRouter } from "next/navigation";
import { getPublicUserInfo, PublicUserResponse } from "@/app/auth/auth.api";
import { AxiosResponse } from "axios";

export const WebSocket = (user: any) => {
  const [socket] = useState(useContext(WebsocketContext));
  const [needRefresh, setNeedRefresh] = useState<boolean>(true);
  const refDiv: MutableRefObject<any> = useRef();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      needRefresh ? router.refresh() : () => {};
    }, 10000);
    socket.on(`ping`, (data) => {
      socket.emit("pong", user);
    });
    socket.on("connectedUser", (data) => {
      refDiv.current.innerText = "Connected user: " + data?.data.length;
      localStorage.setItem("connectedUser", JSON.stringify(data?.data));
      setNeedRefresh(false);
    });
    return () => {
      console.log("Unregister");
      socket.off("ping");
      socket.off("connectedUser");
      socket.disconnect();
    };
  }, []);
  return (
    <div ref={refDiv} className={styles.container}>
      Connected user: 1
    </div>
  );
};
