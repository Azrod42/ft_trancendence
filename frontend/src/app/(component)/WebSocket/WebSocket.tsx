'use client'
import {useContext, useEffect, useState} from "react";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";


export const WebSocket = () => {
    const [socket] = useState(useContext(WebsocketContext))
    const [nbUser, setNbUser] = useState<number>(0)

    useEffect(() => {
        socket.on('connect', () => {
            console.log('User connected');
        });
        socket.on('channelMessage', (data) => {
            console.log(data);
        });

        return () => {
            console.log('Unregister');
            socket.off('connect', );
            socket.off('channelMessage');
            socket.disconnect();
        }
    },[]);
    return (
        <div>

        </div>
    )
}