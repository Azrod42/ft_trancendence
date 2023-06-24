import React from 'react'
import Layout from "@/app/dashboard/social/(layout)/SocialLayout"
import { HomeButtons } from '@/app/dashboard/social/chat-home/chatHomeComponent'
import { ChannelCategory } from './channelHomeComponent'
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css"


interface ChannelHomeProps {
}

const ChannelHome: React.FC<ChannelHomeProps> = ({}) => {

	return (
			<div className={styles.middleContainer}>
				<HomeButtons
					firstButtonText="Join a channel"
					firstButtonUrl="/dashboard/social/channelSearch/search-public"
					secondButtonText="Create new channel"
					secondButtonUrl="/dashboard/social/channel-create"
				/>
			</div>
	)
}

export default ChannelHome;
