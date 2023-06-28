import React from 'react'
import styles from "./dashboard.module.css"
import Link from 'next/link';
import {WebSocket} from "@/app/(component)/WebSocket/WebSocket";


interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<div className={styles.containerchild}></div>
		<div className={styles.containerchild}>Need Game and Chat</div>
		<div className={styles.containerchild}>Need Game and Chat</div>
		<div className={styles.containerchild}>Need Game and Chat</div>
		<div className={styles.containerchild}>Need Game and Chat</div>
	</div>
  )
}

export default Dashboard;
