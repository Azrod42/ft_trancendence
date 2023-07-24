"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import styles from "./globals.module.css";
import backgound from "../../public/background/main-backgound.jpg";
import React, { useState, useEffect } from "react";
import { socket } from "@/app/socket";

//QUERY CLIENT don't touch for now
const queryClient = new QueryClient({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any>([]);

  useEffect(() => {
    //console.log('useEffect')
    function onConnect() {
      setIsConnected(true);
      //console.log('connected')
    }

    function onDisconnect() {
      setIsConnected(false);
      //console.log('disconnect')
    }

    function onFooEvent(value: any) {
      setFooEvents((previous: any) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <html lang="en" className={styles.html}>
      <body
        style={{
          backgroundImage: `url(${backgound.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
          height: "96vh",
        }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </body>
    </html>
  );
}
