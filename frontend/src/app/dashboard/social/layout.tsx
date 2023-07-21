"use client"
import React, {useEffect} from 'react';
import Layout from "@/app/dashboard/social/(layout)/SocialLayout";
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css";
import {ChannelCategory} from "@/app/dashboard/social/channel-home/channelHomeComponent";
import {ChatCategory} from "@/app/dashboard/social/chat-home/chatHomeComponent";
import {usePathname} from "next/navigation";
import {notInGame} from "@/app/auth/auth.api";


export default function RootLayout({children,}: {children: React.ReactNode}) {
    let param: string = usePathname()
    param = param.substring(18);
    param = param.slice(0, 5);
    useEffect(() => {
        notInGame().then((res) => {});
    },[])
    return (
        <div className={styles.container}>
            <Layout>
                <div className={styles.container}>
                    { param == 'chann' ?
                        <ChannelCategory/>
                        :
                        <ChatCategory/>
                    }
                </div>
            </Layout>
            {children}
        </div>
    )
}