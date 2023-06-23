import React from 'react';
import Layout from "../../layout/SocialLayout"
import { ChannelCategory } from '../../channelHome/channelHomeComponent'
import styles from "../../chatHome/chatHome.module.css"

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
