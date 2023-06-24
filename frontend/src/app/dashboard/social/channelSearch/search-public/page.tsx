import React from 'react';
import Layout from "@/app/dashboard/social/(layout)/SocialLayout"
import { ChannelCategory } from '@/app/dashboard/social/channel-home/channelHomeComponent'
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css"

interface ChannelSearchPublicProps {
}

const ChannelSearchPublic: React.FC<ChannelSearchPublicProps> = ({}) => {
	return (
		<Layout>
			<div className={styles.container}>
				<ChannelCategory/>
			</div>
		</Layout>
	)
}

export default ChannelSearchPublic;
