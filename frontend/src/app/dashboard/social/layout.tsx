"use client"
import React, { useEffect, useState } from 'react';
import Layout from "@/app/dashboard/social/(layout)/SocialLayout";
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css";
import {ChannelCategory} from "@/app/dashboard/social/channel-home/channelHomeComponent";
import {ChatCategory} from "@/app/dashboard/social/chat-home/chatHomeComponent";
import { useRouter } from 'next/router'
import {usePathname} from "next/navigation";
import {UserAuthResponse} from "@/app/auth/auth.api";
import {useQuery} from "react-query";
import {isUserLog} from "@/app/(common)/checkLog";


export default function RootLayout({children,}: {children: React.ReactNode}) {
    let param: string = usePathname()
    param = param.substring(18);
	const endIndex = param.indexOf('-');
	param = param.substring(0, endIndex !== -1 ? endIndex : undefined)
    return (
        <div>
            <Layout>
                <div className={styles.container}>
                    { param == 'channel' ?
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