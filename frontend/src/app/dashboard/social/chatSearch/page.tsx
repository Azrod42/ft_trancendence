import React from 'react';
import Layout from "../layout/SocialLayout"
import { ChatCategory } from '../chatHome/chatHomeComponent'
import styles from "../chatHome/chatHome.module.css"

interface ChatSearchProps {
}

const ChatSearch: React.FC<ChatSearchProps> = ({}) => {
	return (
			<Layout>
			<div className={styles.container}>
				<ChatCategory/>
			</div>
		</Layout>
	)
}

export default ChatSearch;
