'use client'
import React, {useEffect} from 'react'
import styles from "./chatHome.module.css"
import Layout from "@/app/dashboard/social/(layout)/SocialLayout"
import { HomeButtons } from './chatHomeComponent';
import {useRouter} from "next/navigation";

interface ChatHomeProps {
}

const ChatHome: React.FC<ChatHomeProps> = ({}) => {
	const {prefetch} = useRouter();

	useEffect(() => {
		prefetch('/dashboard/social/channel-home');
	}, [])
	return (
		<>
			<div className={styles.middleContainer}>
				<HomeButtons
					firstButtonText="Send new message"
					firstButtonUrl="/dashboard/social/chat-search"
					secondButtonText="See channels"
					secondButtonUrl="/dashboard/social/channelSearch/search-public"
				/>
			</div>
		</>
  )
}

export default ChatHome;
