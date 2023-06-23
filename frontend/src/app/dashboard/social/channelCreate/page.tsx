import React from 'react';
import Layout from "../layout/SocialLayout"
import { ChannelCategory } from '../channelHome/channelHomeComponent'
import styles from "../chatHome/chatHome.module.css"

interface ChannelCreateProps {
}

const ChannelCreate: React.FC<ChannelCreateProps> = ({}) => {
	return (
			<Layout>
			<div className={styles.container}>
				<ChannelCategory/>
			</div>
		</Layout>
	)
}

export default ChannelCreate;
