import React from 'react'
import styles from "./chatHome.module.css"
import Layout from "@/app/dashboard/social/(layout)/SocialLayout"
import { Category, ChatCategory, HomeButtons } from './chatHomeComponent';

interface ChatHomeProps {
}

const ChatHome: React.FC<ChatHomeProps> = ({}) => {

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
