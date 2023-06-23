import React from 'react'
import Layout from "../layout/SocialLayout"
import { HomeButtons } from '../chatHome/chatHomeComponent'
import { ChannelCategory } from './channelHomeComponent'
import styles from "../chatHome/chatHome.module.css"


interface ChannelHomeProps {
}

const ChannelHome: React.FC<ChannelHomeProps> = ({}) => {

	return (
		<>
			<Layout>
				<div className={styles.container}>
					<ChannelCategory/>
				</div>
			</Layout>
			<div className={styles.middleContainer}>
				<HomeButtons
					firstButtonText="Join a channel"
					firstButtonUrl="/dashboard/social/channelSearch/searchPublic"
					secondButtonText="Create new channel"
					secondButtonUrl="/dashboard/social/channelCreate"
				/>
			</div>
		</>
	)
}

export default ChannelHome;
