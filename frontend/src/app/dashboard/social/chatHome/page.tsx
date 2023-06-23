import React from 'react'
import styles from "./chatHome.module.css"
import Layout from "../layout/SocialLayout"
import { Category, ChatCategory, HomeButtons } from './chatHomeComponent';

interface ChatHomeProps {
}

const ChatHome: React.FC<ChatHomeProps> = ({}) => {

	return (
		<>
			<Layout>
				<ChatCategory/>
			</Layout>
			<div className={styles.middleContainer}>
				<HomeButtons
					firstButtonText="Send new message"
					firstButtonUrl="/dashboard/social/chatSearch"
					secondButtonText="See channels"
					secondButtonUrl="/dashboard/social/channelSearch/searchPublic"
				/>
			</div>
		</>
  )
}

export default ChatHome;
