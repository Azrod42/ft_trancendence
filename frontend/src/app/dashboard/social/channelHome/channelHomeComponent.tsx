import React from 'react';
import { Category } from '../chatHome/chatHomeComponent';
import styles from "../chatHome/chatHome.module.css"

export const ChannelCategory: React.FC = () => {
	return (
		<div className={styles.container}>
			<Category title="Private Channels" count={0} />
			<Category title="Public Channels" count={0} />
			<Category title="Protected Channels" count={0} />
		</div>		
	)
}
